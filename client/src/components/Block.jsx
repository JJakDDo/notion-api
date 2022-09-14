import React from "react";
import { findListGroupIndex } from "../utils/utils";
import { Box, Container, Typography, Divider, FormGroup, FormControlLabel, Checkbox, List, ListItem, Accordion, AccordionSummary, AccordionDetails  } from '@mui/material';
import { ExpandMore  } from '@mui/icons-material'
const OL_TYPE = ["decimal", "lower-alpha", "lower-roman"];

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

const Block = ({ value, blockGroup, depth }) => {
  const { id, type, properties, children } = value;
  switch (type) {
    case "page": {
      return (<Box sx={{
      display: 'flex',
      flexDirection: 'column',justifyContent: 'center', alignItems: 'center'}}>
          <div style={{width: '100vw', height: '250px', overflow: 'hidden'}}>
            <img src={properties.cover} style={{width: '100%'}}></img>
          </div>
          <Typography variant='title' component='div'>{properties.title.text}</Typography>
        </Box>)
    }
    case "heading_1": {
      return <Typography variant='h1'>{renderText(properties.title)}</Typography>;
    }
    case "heading_2": {
      return <Typography variant='h2'>{renderText(properties.title)}</Typography>;
    }
    case "heading_3": {
      return <Typography variant='h3'>{renderText(properties.title)}</Typography>;
    }
    case "paragraph": {
      return <Typography variant='p' component='p' sx={{width: '70%'}}>{renderText(properties.title)}</Typography>;
    }
    case "to_do": {
      return (<FormGroup sx={{width: '70%', padding: '0 24px'}}>
        <FormControlLabel control={<Checkbox checked={properties.checked} />} label={renderText(properties.title)} />
      </FormGroup>
      );
    }
    case "divider": {
      return <Divider variant="middle" sx={{width:'70%',
      marginTop: '0.6em',
      marginBottom: '0.6em'}}/>;
    }
    case "bulleted_list_item": {
      return (
        <List sx={{
          width: '70%',
          listStyleType: 'disc',
           padding: '0 24px 0 48px',
          '& .MuiListItem-root': {
           display: 'list-item',
          },
         }}>
          <ListItem>{renderText(properties.title)}</ListItem>
          {Object.keys(children).map((child) => {
            return (
              <Block
                key={child}
                value={children[child].value}
                blockGroup={blockGroup}
              />
            );
          })}
        </List>
      );
    }
    case "numbered_list_item": {
      const startIndex = findListGroupIndex(blockGroup, id);
      return (
        <List sx={{
          width: '70%',
          listStyleType: OL_TYPE[depth],
           padding: '0 24px 0 48px',
          '& .MuiListItem-root': {
           display: 'list-item',
          },
         }}
          start={startIndex}
          type={OL_TYPE[depth]}>
          <ListItem start={startIndex}>{renderText(properties.title)}</ListItem>
          {Object.keys(children).map((child) => {
            return (
              <Block
                key={child}
                value={children[child].value}
                blockGroup={blockGroup}
              />
            );
          })}
        </List>
        // <ol start={startIndex} type={OL_TYPE[depth]}>
        //   <li>{renderText(properties.title)}</li>
        //   {Object.keys(children).map((child) => {
        //     return (
        //       <Block
        //         key={child}
        //         value={children[child].value}
        //         blockGroup={blockGroup}
        //         depth={depth + 1}
        //       />
        //     );
        //   })}
        // </ol>
      );
    }
    case "toggle": {
      return (
        <Accordion sx={{width: '65%',
        margin: '10px 24px',}}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
          >
            <Typography>{renderText(properties.title)}</Typography>
          </AccordionSummary>
          <AccordionDetails>            
            {Object.keys(children).map((child) => {
              return (
                <Block
                  key={child}
                  value={children[child].value}
                  blockGroup={blockGroup}
                />
              );
            })}
          </AccordionDetails>
        </Accordion>
      );
    }
    case "image": {
      return (
        <Container sx={{position: 'relative', width: '70%', mt: '10px', mb: '10px'}}>
          <img src={properties.url} style={{width: '100%', objectFit: 'contain'}}></img>
        </Container>
      )
    }
    default: {
      return <div />;
    }
  }
};

export default Block;
