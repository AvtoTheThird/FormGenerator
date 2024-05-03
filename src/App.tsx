import { useEffect, useState } from "react";
import "./App.css";
// import SyntaxHighlighter from "react-syntax-highlighter";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Field, formSettings, componentType, stateType, types } from "./common";

function App() {
  const [form, setForm] = useState([] as Field[]);
  const [editing, setEditing] = useState<boolean>(false);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [formSetings, setFormSettings] = useState<formSettings>({
    generateState: true,
    componentType: componentType.functional,
    stateType: stateType.multiple,
  });
  const [code, setCode] = useState("");
  const [currentField, setCurrentField] = useState<Field>({
    name: "",
    polaceholder: "",
    lable: false,
    labelValue: "",
    type: types.text,
    required: false,
    state: true,
  });
  const defaultValues = {
    name: "",
    polaceholder: "",
    lable: false,
    labelValue: "",
    type: types.text,
    required: false,
    state: false,
  };
  function toCamelCase(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }

  function handleAdd() {
    setForm([...form, currentField]);
    setCurrentField(defaultValues);
  }

  useEffect(() => {
    setCode("import React from 'react';\nimport { useState } from 'react';\n");

    formSetings.stateType === stateType.multiple
      ? generateState()
      : generateStateObject();

    generateCode();
  }, [form, formSetings]);

  const generateStateObject = () => {
    setCode((prev) =>
      prev.concat(
        `const [formData, setFormData] = useState({\n${form.map((field) => {
          return toCamelCase(field.name) + ':""\n';
        })}})`
      )
    );
  };
  const generateState = () => {
    form.map((field, index) => {
      setCode((prev) =>
        prev.concat(
          // field.name.charAt(0).toUpperCase() + field.name.slice(1)
          `const [${toCamelCase(field.name)}, set${
            toCamelCase(field.name).charAt(0).toUpperCase() +
            toCamelCase(field.name).slice(1)
          }] = useState("")\n`
        )
      );
    });
  };
  const generateCode = () => {
    form.map((field, index) => {
      setCode((prev) =>
        prev.concat(`//${field.name} input
        <div>
            ${
              field.lable
                ? `<label htmlFor="${field.name}">${field.labelValue}</label>`
                : ""
            }
            <input type="${field.type}" placeholder="${field.polaceholder}" ${
          field.required ? "required" : ""
        }              ${
          field.state
            ? formSetings.stateType === stateType.multiple
              ? `
            onChange={(e) => {
            set${
              toCamelCase(field.name).charAt(0).toUpperCase() +
              toCamelCase(field.name).slice(1)
            }(e.target.value)
          }}
            `
              : `
            onChange={(e) => {
           set${
             toCamelCase(field.name).charAt(0).toUpperCase() +
             toCamelCase(field.name).slice(1)
           }({ ...FormData, name: e.target.value });
          }}`
            : ""
        }/>
            </div>`)
      );
    });
  };

  return (
    <>
      {/* form setings */}
      <div style={{ border: "1px solid black", padding: "10px" }}>
        <h2>form settings</h2>

        <label htmlFor="state">generate state?</label>

        <input
          type="checkbox"
          name="state"
          id="state"
          checked={formSetings.generateState}
          onChange={(e) => {
            setFormSettings({
              ...formSetings,
              generateState: e.target.checked,
            });
          }}
        />
        <select name="type" id="">
          <option value={componentType.functional}>functional</option>
          <option value={componentType.class}>class</option>
        </select>

        <select
          onChange={(e) =>
            setFormSettings({
              ...formSetings,
              stateType: e.target.value as stateType,
            })
          }
          name="stateType"
          id=""
        >
          <option value={stateType.multiple}> multiple fields</option>
          <option value={stateType.singleObject}> single object</option>
        </select>
      </div>
      {/* field settings */}
      <div style={{ border: "1px solid black", padding: "10px" }}>
        <h2>add fields</h2>{" "}
        <div>
          <input
            type="text"
            placeholder="name"
            required
            value={currentField.name}
            onChange={(e) => {
              setCurrentField({ ...currentField, name: e.target.value });
            }}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="polaceholder"
            required
            value={currentField.polaceholder}
            onChange={(e) => {
              setCurrentField({
                ...currentField,
                polaceholder: e.target.value,
              });
            }}
          />
        </div>
        <div>
          <label htmlFor="label">label</label>
          <input
            type="checkbox"
            name="label"
            checked={currentField.lable}
            required
            onChange={() => {
              setCurrentField({ ...currentField, lable: !currentField.lable });
            }}
          />
          <br />
          {currentField.lable ? (
            <input
              type="text"
              onChange={(e) => {
                setCurrentField({
                  ...currentField,
                  labelValue: e.target.value,
                });
              }}
            />
          ) : null}
        </div>
        <select
          name="type"
          id=""
          required
          onChange={(e) =>
            setCurrentField({ ...currentField, type: e.target.value as types })
          }
        >
          <option value={types.text}>Text</option>
          <option value={types.number}>Number</option>
          <option value={types.email}>Email</option>
          <option value={types.password}>Password</option>
        </select>
        <div>
          <label htmlFor="required">required</label>
          <input
            type="checkbox"
            name="required"
            checked={currentField.required}
            onChange={(e) =>
              setCurrentField({ ...currentField, required: e.target.checked })
            }
          />
        </div>
        <div>
          <label htmlFor="state">does this field have state?</label>
          <input
            type="checkbox"
            checked={currentField.state}
            name="state"
            onChange={(e) =>
              setCurrentField({ ...currentField, state: e.target.checked })
            }
          />
        </div>
      </div>
      <button onClick={handleAdd}>ADD</button>
      <div className="window-continer">
        {form.map((field, index) => {
          return (
            <div className="window" key={index}>
              <div className="window-field">
                name:
                {editing && index === editingIndex ? (
                  <input
                    type="text"
                    placeholder="name"
                    required
                    value={form[index].name}
                    onChange={(e) => {
                      const newArr = form.map((field, indexi) => {
                        if (indexi === index) {
                          return {
                            ...field,
                            name: e.target.value,
                          };
                        }
                        return field;
                      });
                      setForm(newArr);
                    }}
                  />
                ) : (
                  <p>{field.name}</p>
                )}
              </div>
              <div className="window-field">
                <p>placeholder:</p>
                {editing && index === editingIndex ? (
                  <input
                    type="text"
                    placeholder="polaceholder"
                    required
                    value={form[index].polaceholder}
                    // value={currentField.polaceholder}
                    onChange={(e) => {
                      const newArr = form.map((field, indexi) => {
                        if (indexi === index) {
                          return {
                            ...field,
                            polaceholder: e.target.value,
                          };
                        }
                        return field;
                      });
                      setForm(newArr);

                      // setCurrentField({
                      //   ...currentField,
                      //   polaceholder: e.target.value,
                      // });
                    }}
                  />
                ) : (
                  <p>{field.polaceholder}</p>
                )}
              </div>

              <div className="window-field">
                label:
                {editing && index === editingIndex ? (
                  <input
                    type="checkbox"
                    name="label"
                    checked={form[index].lable}
                    required
                    onChange={() => {
                      setForm(
                        form.map((field, index) => {
                          if (index === index) {
                            return {
                              ...field,
                              lable: !field.lable,
                            };
                          }
                          return field;
                        })
                      );
                    }}
                  />
                ) : (
                  <p>{field.lable ? "true" : "false"}</p>
                )}
              </div>
              {field.lable ? (
                editing && index === editingIndex ? (
                  <input
                    type="text"
                    name="label text"
                    value={form[index].labelValue}
                    onChange={(e) => {
                      setForm(
                        form.map((field, indexi) => {
                          if (indexi === index) {
                            return {
                              ...field,
                              labelValue: e.target.value,
                            };
                          }
                          return field;
                        })
                      );
                    }}
                  />
                ) : (
                  <p>labelValue:{field.labelValue}</p>
                )
              ) : null}
              <p>type:{field.type}</p>
              <div className="window-field">
                required:
                {editing && index === editingIndex ? (
                  <input
                    type="checkbox"
                    name="required"
                    checked={form[index].required}
                    onChange={() =>
                      setForm(
                        form.map((field, index) => {
                          if (index === index) {
                            return {
                              ...field,
                              required: !field.required,
                            };
                          }
                          return field;
                        })
                      )
                    }
                  />
                ) : (
                  <p>{field.required ? "true" : "false"}</p>
                )}
              </div>
              <div className="window-field">
                state:
                {editing && index === editingIndex ? (
                  <input
                    type="checkbox"
                    checked={form[index].state}
                    name="state"
                    id=""
                    onChange={() => {
                      setForm(
                        form.map((field, index) => {
                          if (index === index) {
                            return {
                              ...field,
                              state: !field.state,
                            };
                          }
                          return field;
                        })
                      );
                    }}
                  />
                ) : (
                  <p>{field.state ? "true" : "fasle"}</p>
                )}
              </div>
              <div>
                <button
                  onClick={() => {
                    setEditing(!editing);
                    setEditingIndex(index);
                  }}
                >
                  {editing && editingIndex ? "save" : "edit"}
                </button>
                <button
                  onClick={() => {
                    const newArray = [...form];
                    newArray.splice(index, 1);
                    setForm(newArray);
                  }}
                >
                  delete
                </button>
              </div>
            </div>
          );
        })}
        {/* 
        <div className="window">
          <p>name:name</p>
          <p>placeholder:placeholder</p>
          <p>label:label</p>
          <p>labelValue:labelValue</p>
          <p>type:type</p>
          <p>required:required</p>
          <p>state:state</p>
        </div> */}
      </div>
      <div>
        <SyntaxHighlighter
          language="jsx"
          style={materialDark}
          showLineNumbers={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </>
  );
}

export default App;
