import React, { Fragment, useEffect, useRef, useState } from "react";
import { Button_Style, editorsTools, Image_Extension, otherTools } from ".";
import { FaDownload, FaRedo, FaUndo } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import { TbRotate360 } from "react-icons/tb";
import {
  // MdOutlineCloudUpload,
  MdOutlineZoomInMap,
  MdOutlineZoomOutMap,
} from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const App = () => {
  const canvasRef = useRef(null);

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  const editToolsRanges = useRef([]);

  let [rotate, setRotate] = useState(0);

  let [zoom, setZoom] = useState(1);

  let defaultRanges = editorsTools.reduce((acc, tool) => {
    acc[tool.toolName] = tool.toolValue.defaultValue;
    return acc;
  }, {});

  const [edit, setEdit] = useState({
    past: [],
    present: defaultRanges,
    future: [],
  });

  const [editImage, setEditImage] = useState({
    selectedImage: undefined,
    pastedURL: undefined,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 900;
    canvas.height = 700;
  }, []);

  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = editImage.pastedURL || editImage.selectedImage;
    image.addEventListener("load", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.scale(zoom, zoom);
      let filterArray = [];
      Object.entries(edit.present).forEach(([key, value], index) => {
        const tool = editorsTools[index];
        if (!tool) return;
        filterArray.push(`${key}(${value}${tool?.toolValueUnit})`);
      });
      ctx.filter = filterArray.join(" ");
      ctx.drawImage(
        image,
        -canvas.width / 2,
        -canvas.height / 2,
        canvas.width,
        canvas.height,
      );
      ctx.restore();
    });

    Object.entries(edit.present).filter(([key, value]) => {
      const toolIndex = editorsTools.findIndex((tool) => tool.toolName === key);
      editToolsRanges.current[toolIndex].value = value;
    });
  };

  useEffect(() => {
    if (!editImage.pastedURL && !editImage.selectedImage) return;
    drawImage();
  }, [edit, editImage, zoom, rotate]);

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
        let previous = prev.past[prev.past.length - 1];
        return {
          past: prev.past.slice(0, -1),
          present: previous,
          future: [prev.present, ...prev.future],
        };
      });
    },
    redo: function () {
      setEdit((prev) => {
        if (!prev.future.length) return prev;
        let next = prev.future[0];
        return {
          past: [...prev.past, prev.present],
          present: next,
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

  const restoreDefault = () => {
    setZoom(1);
    setRotate(0);
    setEdit((prev) => ({
      ...prev,
      past: [],
      present: defaultRanges,
      future: [],
    }));
  };

  const handlingSelectedImage = (event) => {
    restoreDefault();
    let value = event.target.files[0];
    let Image_Extension_Verify = Image_Extension.map((e) => {
      return value?.name.endsWith(`.${e}`);
    }).some((e) => e === true);
    if (!Image_Extension_Verify || !value.type.includes("image")) {
      console.log("Invalid Extension");
      return;
    }
    const temporaryUrl = URL.createObjectURL(value);
    setEditImage(() => {
      return {
        selectedImage: temporaryUrl,
        pastedURL: undefined,
      };
    });
  };

  const handlingURLImageInput = (event) => {
    restoreDefault();
    let value = event.target.value;
    if (
      !value ||
      /\s{2,}/.test(value) ||
      value.startsWith(" ") ||
      !value.startsWith("https://")
    ) {
      console.log("Invalid URL");
      return;
    }
    setEditImage(() => ({
      selectedImage: undefined,
      pastedURL: value,
    }));
  };

  // const handlingURLImage = async () => {
  //   restoreDefault();
  //   try {
  //     const response = await fetch(URL, { method: "HEAD" });
  //     const contentType = response.headers.get("content-type");
  //     if (!response.ok) {
  //       console.log(response);
  //       return;
  //     }
  //     if (contentType || contentType.startsWith("image/")) {
  //       setEditImage(() => ({
  //         selectedImage: undefined,
  //         pastedURL: editImage.pastedURL,
  //       }));
  //       return;
  //     }
  //   } catch (error) {
  //     console.error("Fetch error:", error);
  //     return false;
  //   }
  // };

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

  let ifImageSelected =
    editImage.pastedURL || editImage.selectedImage ? false : true;

  const otherToolsHandler = (max, defaultValue, toolValueUnit) => {
    if (toolValueUnit === "deg") {
      setRotate((prev) => prev + 90);
      if (rotate >= max) {
        setRotate(defaultValue);
        return;
      }
    } else {
      setZoom((prev) => prev + 1);
      if (zoom >= max) {
        canvasRef.current.style.cursor = `zoom-out`;
        setZoom(defaultValue);
        return;
      }
    }
  };

  const downloadImage = () => {
    if (!editImage.pastedURL && !editImage.selectedImage) return;
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `Lumina-Forge.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <Fragment>
      <main className="w-full h-full bg-Dark-BG font-Allenoire-Font bg-Dark-2">
        {loading && (
          <div className="w-full fixed bg-black/50 z-10 h-screen flex justify-center items-center text-3xl text-Light-2">
            Loading..
          </div>
        )}

        <nav className="w-full h-37.5 p-3 text-center bg-Dark-1 shadow-2xl">
          <h1 className="font-bold bg-linear-to-r from-Dark-1 to-Light-2 text-transparent bg-clip-text text-6xl md:text-9xl">
            Lumina Forge
          </h1>
        </nav>

        <div className="bg-Dark-1 border border-l-0 border-Light-1 w-full h-40 min-h-max flex flex-wrap justify-evenly items-center p-3">
          <label
            htmlFor="Select_Image"
            className="flex flex-col justify-around items-center h-full w-full sm:w-auto p-2"
            onClick={inputFileClicker}
          >
            <button className={Button_Style} disabled={loading}>
              <span>Select Image</span>
              <BiImageAdd size={30} />
            </button>
            <input
              type="file"
              required
              disabled={loading}
              accept="image/*"
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
              onChange={handlingURLImageInput}
              className="text-Light-1 tracking-wider text-lg border p-2 min-w-75 w-full"
            />
          </label>
          {/* <button
            className={Button_Style}
            onClick={handlingURLImage}
            disabled={loading}
          >
            Upload
            {loading ? (
              <AiOutlineLoading3Quarters size={20} className="animate-spin" />
            ) : (
              <MdOutlineCloudUpload size={20} />
            )}
          </button> */}
        </div>
        <div className="flex flex-col md:flex-row h-full bg-Dark-1 items-start justify-between p-3 gap-5 relative">
          <FaDownload
            className="absolute top-10 left-1/2 -translate-x-1/2 cursor-pointer"
            color="green"
            size={30}
            onClick={downloadImage}
          />
          <div className="w-full md:w-1/2 flex flex-col items-start justify-center gap-5 relative overflow-hidden h-full">
            <div
              className={`flex justify-evenly items-center w-full`}
              style={{
                marginBottom: "50px",
                marginTop: "10px",
              }}
            >
              {otherTools.map((elem, index) => {
                const { toolName, toolValue, toolValueUnit } = elem;
                const { max, defaultValue } = toolValue;
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={() => {
                      otherToolsHandler(max, defaultValue, toolValueUnit);
                    }}
                    id={toolName}
                    className={Button_Style}
                    disabled={ifImageSelected || loading}
                  >
                    {toolName.replace(/[^a-zA-Z0-9\s]/g, " ")}
                    {toolValueUnit === "deg" ? (
                      <TbRotate360 size={20} />
                    ) : zoom > 1 ? (
                      <MdOutlineZoomInMap size={20} />
                    ) : (
                      <MdOutlineZoomOutMap size={20} />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="overflow-hidden">
              <canvas
                ref={canvasRef}
                className="bg-black/20 shadow-2xl w-full h-auto max-h-[70vh] md:max-h-full"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 h-full">
            <div className="w-full flex flex-wrap justify-evenly items-center gap-3">
              <button
                onClick={editHandler.undo}
                className={Button_Style}
                disabled={ifImageSelected || loading}
                type="button"
              >
                Undo
                <FaUndo size={20} />
              </button>
              <button
                onClick={editHandler.redo}
                className={Button_Style}
                type="button"
                disabled={ifImageSelected || loading}
              >
                Redo <FaRedo size={20} />
              </button>
            </div>

            <form className="flex flex-wrap justify-between items-start gap-4 mt-5">
              {editorsTools.map((elem, index) => {
                const { toolName, toolValue } = elem;
                const { min, max } = toolValue;
                return (
                  <React.Fragment key={index}>
                    <label
                      htmlFor={toolName}
                      className="flex flex-col justify-center sm:justify-between items-start gap-2 text-sm md:text-lg text-Light-2 capitalize tracking-[2px] xl:w-75 w-full"
                    >
                      {toolName.replace(/[^a-zA-Z0-9\s]/g, " ")}
                      <input
                        type="range"
                        className="p-2 w-full in-range:bg-amber-200"
                        onChange={editHandler.edit}
                        id={toolName}
                        disabled={ifImageSelected || loading}
                        name={toolName}
                        max={max}
                        min={min}
                        defaultValue={edit.present[toolName]}
                        ref={(el) => (editToolsRanges.current[index] = el)}
                      />
                      <div className="flex flex-row justify-between w-full">
                        <span>{min}</span>
                        <span>{edit.present[toolName]}</span>
                        <span>{max}</span>
                      </div>
                    </label>
                  </React.Fragment>
                );
              })}
            </form>
          </div>
        </div>
      </main>
    </Fragment>
  );
};
export default App;
