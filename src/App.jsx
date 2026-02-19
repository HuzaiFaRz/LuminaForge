import React, { Fragment } from "react";
import car from "./assets/car.jpeg";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

export default function App() {
  let editorsTools = {
    filter: [
      {
        toolsName: "blur",
        toolValueUnit: "px",
        toolValue: { min: 0, max: 20, defaultValue: 0 },
      },
      {
        toolsName: "brightness",
        toolValueUnit: "%",
        toolValue: { min: 0, max: 1000, defaultValue: 100 },
      },
      {
        toolsName: "contrast",
        toolValue: { min: 0, max: 10, defaultValue: 1 },
      },
      {
        toolsName: "saturate",
        toolValueUnit: "%",
        toolValue: { min: 0, max: 1000, defaultValue: 100 },
      },
      {
        toolsName: "sepia",
        toolValueUnit: "%",
        toolValue: { min: 0, max: 100, defaultValue: 0 },
      },
      {
        toolsName: "grayscale",
        toolValueUnit: "%",
        toolValue: { min: 0, max: 100, defaultValue: 0 },
      },
      {
        toolsName: "hue-rotate",
        toolValueUnit: "deg",
        toolValue: { min: 0, max: 180, defaultValue: 0 },
      },
      {
        toolsName: "invert",
        toolValueUnit: "%",
        toolValue: { min: 0, max: 100, defaultValue: 0 },
      },
      {
        toolsName: "opacity",
        toolValueUnit: "%",
        toolValue: { min: 0, max: 100, defaultValue: 100 },
      },
    ],
    rotate: {
      toolsName: "rotate",
      toolValueUnit: "deg",
      toolValue: { min: 0, max: 360, defaultValue: 0 },
    },
    objectPosition: {
      toolsName: "objectPosition",
      toolValueUnit: "px",
      // topPostions: [, "bottom", "right", "left"],
      Postions: {
        top: { min: 0, max: 300 },
        bottom: { min: 0, max: 300 },
      },
    },
    zoom: {
      toolsName: "scale",
      toolValue: { min: 1, max: 3, defaultValue: 0 },
    },
  };

  return (
    <Fragment>
      <Container fluid className="bg-dark text-light h-100">
        <Row>
          <Col>1 of 1</Col>
          <Col className="h-">
            {editorsTools.filter.map((elem, index) => {
              const { toolsName, toolValueUnit, toolValue } = elem;
              const { min, max, defaultValue } = toolValue;

              return (
                <React.Fragment key={index}>
                  <Form.Label>
                    {toolsName.replace(/[^a-zA-Z0-9\s]/g, " ")}
                  </Form.Label>
                  <Form.Range />
                </React.Fragment>
              );
            })}
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}
