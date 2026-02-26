import React, { Fragment, useEffect, useRef, useState } from "react";
import logo from "./assets/Images/Logo.png";
import {
  Button_Style,
  editorsTools,
  Image_Extension,
  Image_URL_Regex,
} from ".";
import { CiImageOn } from "react-icons/ci";
import { FaImage } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";

const App = () => {
  const imageRef = useRef(null);

  const canvasRef = useRef(null);

  const editToolsRanges = useRef([]);

  let [rotate, setRotate] = useState(90);

  let defaultRanges = editorsTools.reduce((acc, tool) => {
    acc[tool.toolName] = tool.toolValue.defaultValue;
    return acc;
  }, {});

  const [edit, setEdit] = useState({
    past: [],
    present: defaultRanges,
    future: [],
  });

  const imageGrapping = (event) => {
    let x = event.clientX;
    let y = event.clientY;
    canvasRef.current.style.objectPosition = `${x}px ${y}px`;
  };

  const [editImage, setEditImage] = useState({
    selectedImage: undefined,
    pastedURL: undefined,
  });

  const imageLoader = (URL) => {
    // if (!canvasRef.current || !imageRef.current) {
    //   return;
    // }

    // const ctx = canvasRef.current.getContext("2d");

    imageRef.current.setAttribute("src", URL);
    console.log(imageRef.current);

    // ctx.drawImage(imageRef.current, 10, 10);
  };

  useEffect(() => {
    if (
      !canvasRef.current ||
      !imageRef.current ||
      !editImage.pastedURL ||
      !editImage.selectedImage
    ) {
      return;
    }

    let canvas = canvasRef.current;

    let filterArray = [];

    const ctx = canvasRef.current.getContext("2d");

    Object.entries(edit.present).forEach(([key, value], index) => {
      const tool = editorsTools[index];
      if (!tool) return;
      if (tool.toolName === "rotate") {
        canvas.style.rotate = `${value}${tool.toolValueUnit}`;
      } else if (tool.toolName === "zoom") {
        canvas.style.transform = `scale(${value}${tool.toolValueUnit})`;
        if (value > 100) {
          canvas.style.cursor = "all-scroll";
          canvas.addEventListener("mousemove", imageGrapping);
        } else {
          canvas.removeEventListener("mousemove", imageGrapping);
        }
      } else {
        filterArray.push(`${key}(${value}${tool?.toolValueUnit})`);
        ctx.filter = filterArray.join(" ");
      }
    });

    if (!editToolsRanges.current.length) {
      return;
    }

    Object.entries(edit.present).filter(([key, value]) => {
      const toolIndex = editorsTools.findIndex((tool) => tool.toolName === key);
      editToolsRanges.current[toolIndex].value = value;
    });
  }, [edit, editImage]);

  let editHandler = {
    edit: function () {
      let name = event.target.id || event.target.name;
      let value = event.target.value;
      let initial = Object.entries(edit.present).filter(([key]) => {
        return key === name;
      });
      setEdit((prev) => {
        let updateValue = {
          ...prev.present,
          [initial[0][0]]: Number(value),
        };
        return {
          ...prev,
          past: [...prev.past, prev.present],
          present: updateValue,
          future: [],
        };
      });
    },
    undo: function () {
      setEdit((prev) => {
        if (!prev.past.length) return prev;
        let copy = prev.past.at(-1);
        return {
          past: prev.past.slice(0, 1),
          present: copy,
          future: [prev.present, ...prev.future],
        };
      });
    },
    redo: function () {
      setEdit((prev) => {
        if (!prev.future.length) return prev;
        let copy = edit.future[0];
        return {
          past: [...prev.past, prev.present],
          present: copy,
          future: prev.future.slice(1),
        };
      });
    },
  };

  let inputFileRef = useRef(null);

  const inputFileClicker = () => {
    if (!inputFileRef.current) {
      return;
    }
    inputFileRef.current.click();
  };

  const currentFileStatusRef = useRef(null);

  const handlingSelectedImage = (event) => {
    // if (editImage.pastedURL) {
    //   console.log(editImage);
    //   console.log("image already pasted");
    //   return;
    // }

    // if (!currentFileStatusRef.current && !inputFileRef.current) {
    //   console.log("input not found");
    //   return;
    // }

    let value = event.target.files[0];
    console.log(value);

    let Image_Extension_Verify = Image_Extension.map((e) => {
      return value?.name.endsWith(`.${e}`);
    }).some((e) => e === true);

    if (!Image_Extension_Verify || !value.type.includes("image")) {
      console.log("Invalid Extension");
      return;
    }

    const temporaryUrl = URL.createObjectURL(value);
    setEditImage(() => {
      imageLoader(temporaryUrl);
      return {
        selectedImage: value,
        pastedURL: undefined,
      };
    });
  };

  useEffect(() => {
    if (!currentFileStatusRef.current && !inputFileRef.current) {
      console.log("input not found");
      return;
    }
    currentFileStatusRef.current.textContent = editImage.pastedURL
      ? "Selected"
      : editImage.selectedImage
        ? editImage.selectedImage?.name
        : "Nothing Selected";
  }, [editImage]);

  const handlingURLImage = async (event) => {
    // if (editImage.selectedImage) {
    //   console.log("image already Selected");
    //   return;
    // }

    let value = event.target.value;

    if (!value || !value.startsWith("https://")) {
      console.log("Invalid URL");
      return;
    }

    // if (!canvasRef.current || !imageRef.current) {
    //   return;
    // }

    try {
      const response = await fetch(URL, { method: "HEAD" });
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        console.log(response);
        return;
      }
      if (contentType || contentType.startsWith("image/")) {
        setEditImage(() => ({
          selectedImage: undefined,
          pastedURL: value,
        }));
        imageLoader(value);
        event.target.value = null;
        return;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return false;
    }
  };

  return (
    <Fragment>
      <main className="w-full h-dvh bg-Dark-BG font-Allenoire-Font bg-Dark-2">
        <nav className="w-full h-37.5 p-3 text-center bg-Dark-1 shadow-2xl">
          <h1 className="font-bold bg-linear-to-r from-Dark-1 to-Light-2 text-transparent bg-clip-text text-6xl md:text-9xl">
            Lumina Forge
          </h1>
        </nav>
        <div className="bg-Dark-1 border border-l-0 border-Light-1 w-full h-40 min-h-max flex flex-wrap justify-evenly items-center p-3">
          <label
            htmlFor="Select_Image"
            className="flex flex-col justify-around items-start h-full w-full sm:w-auto"
            onClick={inputFileClicker}
          >
            <button className={Button_Style}>
              <span>Select Image</span>
              <BiImageAdd size={30} />
            </button>
            <input
              type="file"
              required
              // accept="image/*"
              multiple={false}
              id="Select_Image"
              ref={inputFileRef}
              onChange={handlingSelectedImage}
              className="text-Light-1 tracking-wider text-xl font-mono invisible hidden"
            />
            <span
              ref={currentFileStatusRef}
              className="font-mono font-bold tracking-wider text-xl text-Light-2"
            >
              Nothing Selected
            </span>
          </label>
          <span className="text-Light-1 p-3 bg-Dark-2">OR</span>
          <label
            htmlFor="Paste_URL"
            className="flex flex-col justify-center gap-5 items-start h-full text-xl text-Light-2 font-mono w-full sm:w-auto"
          >
            <span>Paste URL</span>
            <input
              type="url"
              id="Paste_URL"
              placeholder="Paste_URL"
              onChange={handlingURLImage}
              className="text-Light-1 tracking-wider text-lg border p-2 min-w-75 w-full"
            />
          </label>
        </div>
        <div className="flex w-full h-full bg-Dark-1">
          {/* <canvas ref={canvasRef} className="h-full w-175 object-contain"> */}
          <img
            ref={imageRef}
            className="h-full w-full object-cover text-xl font-mono p-2"
            alt="Image"
          />
          {/* </canvas> */}
        </div>
      </main>

      {/* <Container fluid className="bg-dark text-light h-100">
        <Row>
          <Col>
            <canvas ref={canvasRef} className="w-100 h-50 border">
              <Image thumbnail ref={imageRef} />
            </canvas>
          </Col>
          <Col className="">
            <Button onClick={editHandler.undo}>Undo</Button>
            <Button onClick={editHandler.redo}>Redo</Button>

            {editorsTools.map((elem, index) => {
              const { toolName, toolValue } = elem;
              const { min, max, defaultValue } = toolValue;
              return (
                <React.Fragment key={index}>
                  <Form.Label>
                    {toolName.replace(/[^a-zA-Z0-9\s]/g, " ")}
                  </Form.Label>
                  <Form.Range
                    onChange={editHandler.edit}
                    id={toolName}
                    name={toolName}
                    max={max}
                    min={min}
                    defaultValue={edit.present[toolName]}
                    ref={(el) => (editToolsRanges.current[index] = el)}
                  />
                </React.Fragment>
              );
            })}

            <Button
              onClick={() => {
                setRotate(rotate + 90);
                canvasRef.current.style.rotate = `${rotate}deg`;
                if (rotate === 360) {
                  setRotate(90);
                  return;
                }
                console.log(imageRef.current instanceof HTMLImageElement);
                canvasRef.current.toBlob((blob) => {
                  const url = URL.createObjectURL(blob);
                  console.log(url);
                });
              }}
            >
              Rotate
            </Button>
          </Col>
        </Row>
      </Container> */}
    </Fragment>
  );
};
export default App;
