import { useEffect, useState } from "react";
import "./App.css";
// import SyntaxHighlighter from "react-syntax-highlighter";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Field {
  name: string;
  polaceholder: string;
  lable: boolean;
  labelValue: string;
  type: types;
  required: boolean;
  state: boolean;
}
interface formSettings {
  generateState: boolean;
  componentType: componentType;
  stateType: stateType;
}

enum stateType {
  multiple = "multiple",
  singleObject = "single Object",
}
enum componentType {
  functional = "functional",
  class = "class",
}
enum types {
  text = "text",
  number = "number",
  email = "email",
  password = "password",
}
function App() {
  const [form, setForm] = useState([] as Field[]);
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
    state: false,
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
  }, [form]);

  const generateStateObject = () => {
    setCode((prev) =>
      prev.concat(
        `const [formData, setFormData] = useState({\n${form.map((field) => {
          return field.name + ':""\n';
        })}})`
      )
    );
  };
  // console.log(code);

  const generateState = () => {
    form.map((field, index) => {
      setCode((prev) =>
        prev.concat(
          `const [${field.name}, set${
            field.name.charAt(0).toUpperCase() + field.name.slice(1)
          }] = useState("")\n`
        )
      );
    });
  };
  const generateCode = () => {
    // setCode("import React from 'react';\nimport { useState } from 'react';\n");

    // setCode(code.concat(state));

    // setCode(
    //   code.concat(
    //     `const [formData, setFormData] = useState({${form.map((field) => {
    //       field.name + ':""';
    //     })}})`
    //   )
    // );

    // form.map((field, index) => {
    //   setCode(
    //     code.concat(`
    //     const [${field.name}, set${
    //       field.name.charAt(0).toUpperCase() + field.name.slice(1)
    //     }] = useState("")

    //         `)
    //   );
    // });

    form.map((field, index) => {
      setCode((prev) =>
        prev.concat(`//${field.name} input
        // ${index} 
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
            ? `
            onChange={(e) => {
            set${
              field.name.charAt(0).toUpperCase() + field.name.slice(1)
            }({ ...FormData, name: e.target.value });
          }}`
            : ""
        }/>
            </div>`)
      );
    });
  };
  // console.log(formSetings);

  return (
    <>
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
