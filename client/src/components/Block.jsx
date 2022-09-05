import React from "react";
import { findListGroupIndex } from "../utils/utils";

const renderText = (titles) => {
  if (!titles.length) {
    return "";
  }

  return titles.map((title, i) => {
    const text = title.text;
    const annotations = title.annotations;
    let styledText = <React.Fragment key={i}>{text}</React.Fragment>;
    if (title.href) {
      styledText = (
        <a href={title.href} key={i}>
          {styledText}
        </a>
      );
    }
    if (annotations.bold) {
      styledText = <b key={i}>{styledText}</b>;
    }
    if (annotations.italic) {
      styledText = <i key={i}>{styledText}</i>;
    }
    if (annotations.strikethrough) {
      styledText = <s key={i}>{styledText}</s>;
    }
    if (annotations.underline) {
      styledText = <u key={i}>{styledText}</u>;
    }
    if (annotations.code) {
      styledText = (
        <code key={i} className={"inline-code"}>
          {styledText}
        </code>
      );
    }
    if (annotations.color !== "default") {
      const color = annotations.color.split("_");
      if (color.length === 1) {
        styledText = (
          <span key={i} style={{ color: color[0] }}>
            {styledText}
          </span>
        );
      } else {
        styledText = (
          <span key={i} style={{ background: color[0] }}>
            {styledText}
          </span>
        );
      }
    }

    return styledText;
  });
};

const Block = ({ value, blockGroup }) => {
  const { id, type, properties, children } = value;
  switch (type) {
    case "page": {
      return <div className='page_title'>{properties.title.text}</div>;
    }
    case "heading_1": {
      return <h1>{renderText(properties.title)}</h1>;
    }
    case "heading_2": {
      return <h2>{renderText(properties.title)}</h2>;
    }
    case "heading_3": {
      return <h3>{renderText(properties.title)}</h3>;
    }
    case "paragraph": {
      return <p>{renderText(properties.title)}</p>;
    }
    case "to_do": {
      return (
        <div className='notion-checkbox'>
          <div
            className={
              properties.checked ? "checkbox-icon-true" : "checkbox-icon-false"
            }
          >
            {properties.checked && (
              <svg viewBox='0 0 14 14'>
                <polygon points='5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039'></polygon>
              </svg>
            )}
          </div>
          <span
            className={
              properties.checked
                ? "checkbox-text checkbox-false"
                : "checkbox-text"
            }
          >
            {renderText(properties.title)}
          </span>
        </div>
      );
    }
    case "divider": {
      return <hr />;
    }
    case "bulleted_list_item": {
      return (
        <ul>
          <li>{renderText(properties.title)}</li>
          {Object.keys(children).map((child) => {
            console.log(children[child]);
            return (
              <Block
                key={child}
                value={children[child].value}
                blockGroup={blockGroup}
              />
            );
          })}
        </ul>
      );
    }
    case "numbered_list_item": {
      const startIndex = findListGroupIndex(blockGroup, id);
      return (
        <ol start={startIndex}>
          <li>{renderText(properties.title)}</li>
          {Object.keys(children).map((child) => {
            console.log(children[child]);
            return (
              <Block
                key={child}
                value={children[child].value}
                blockGroup={blockGroup}
              />
            );
          })}
        </ol>
      );
    }
    case "toggle": {
      return (
        <details>
          <summary>{renderText(properties.title)}</summary>
          {Object.keys(children).map((child) => {
            console.log(children[child]);
            return (
              <Block
                key={child}
                value={children[child].value}
                blockGroup={blockGroup}
              />
            );
          })}
        </details>
      );
    }
    default: {
      return <div />;
    }
  }
};

export default Block;
