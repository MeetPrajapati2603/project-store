import React, { useRef, useState } from "react";
import styles from "./ProjectForm.module.css";
import Modal from "../../Modal/Modal";
import InputControl from "../../InputControl/InputControl";
import { X } from "react-feather";
import { addProjectInDatabase, uploadImage, updateProjectInDatabase } from "../../../firebase";

function ProjectForm(props) {
  const fileInputRef = useRef();
  const isEdit = props.isEdit ? true : false;
  const defaults = props.default;

  const [values, setValues] = useState({
    thumbnail: defaults?.thumbnail || "",
    title: defaults?.title || "",
    overview: defaults?.overview || "",
    github: defaults?.github || "",
    link: defaults?.link || "",
    points: defaults?.points || ["", ""],
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [imageUploadStarted, setImageUploadStarted] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const handlePointUpdate = (value, index) => {
    const tempPoints = [...values.points];
    tempPoints[index] = value;
    setValues((prev) => ({ ...prev, points: tempPoints }));
  };

  const handleAddPoint = () => {
    if (values.points.length > 4) return;
    setValues((prev) => ({ ...prev, points: [...values.points, ""] }));
  };

  const handlePointDelete = (index) => {
    const tempPoints = [...values.points];
    tempPoints.splice(index, 1);
    setValues((prev) => ({ ...prev, points: tempPoints }));
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageUploadStarted(true);
    uploadImage(
      file,
      (progress) => {
        setImageUploadProgress(progress);
      },
      (url) => {
        setImageUploadStarted(false);
        setImageUploadProgress(0);
        setValues((prev) => ({ ...prev, thumbnail: url }));
      },
      (error) => {
        setErrorMessage(error);
        setImageUploadStarted(false);
      }
    );
  };

  const validateForm = () => {
    const actualPoints = values.points.filter((item) => item.trim());

    let isValid = true;

    if (!values.thumbnail) {
      isValid = false;
      setErrorMessage("Thumbnail for project is required");
    } else if (!values.github) {
      isValid = false;
      setErrorMessage("Project's repository link required");
    } else if (!values.title) {
      isValid = false;
      setErrorMessage("Project's Title required");
    } else if (!values.overview) {
      isValid = false;
      setErrorMessage("Project's Overview required");
    } else if (!actualPoints.length) {
      isValid = false;
      setErrorMessage("Description of Project is required");
    } else if (actualPoints.length < 2) {
      isValid = false;
      setErrorMessage("Minimum 2 description points required");
    } else {
      setErrorMessage("");
    }

    return isValid;
  };

  const handleSubmission = async () => {
    if (!validateForm()) return;

    setSubmitButtonDisabled(true);
    if (isEdit)
      await updateProjectInDatabase(
        { ...values, refUser: props.uid },
        defaults.pid
      );
    else await addProjectInDatabase({ ...values, refUser: props.uid });
    setSubmitButtonDisabled(false);
    if (props.onSubmission) props.onSubmission();
    if (props.onClose) props.onClose();
  };

  return (
    <Modal onClose={() => (props.onClose ? props.onClose() : "")}>
      <div className={styles.container}>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileInputChange}
        />
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className={styles.image}>
              <img
                src={
                  values.thumbnail ||
                  "https://wallpapercave.com/wp/wp3082268.jpg"
                }
                alt="Thumbnail"
                onClick={() => {
                  fileInputRef.current.click();
                }}
              />
              {imageUploadStarted && (
                <p>
                  <span>{imageUploadProgress.toFixed(2)}%</span> Uploaded
                </p>
              )}
            </div>
            <InputControl
              Label={"GitHub"}
              value={values.github}
              placeholder="Enter GitHub repository link"
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  github: event.target.value,
                }))
              }
            />
            <InputControl
              Label={"Deployed Link"}
              placeholder="Enter the live link of project"
              value={values.link}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  link: event.target.value,
                }))
              }
            />
          </div>
          <div className={styles.right}>
            <InputControl
              Label={"Project Title"}
              value={values.title}
              placeholder="Enter the title of project"
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
            />
            <InputControl
              Label={"Project Overview"}
              placeholder="Enter the overview of project"
              value={values.overview}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  overview: event.target.value,
                }))
              }
            />
            <div className={styles.description}>
              <div className={styles.top}>
                <p className={styles.title}>Project Description</p>
                <p className={styles.link} onClick={handleAddPoint}>
                  +Add Point
                </p>
              </div>
              <div className={styles.inputs}>
                {values.points.map((item, index) => (
                  <div className={styles.input} key={index}>
                    <InputControl
                      key={index}
                      value={item}
                      placeholder="Type something..."
                      onChange={(event) =>
                        handlePointUpdate(event.target.value, index)
                      }
                    />
                    {index > 1 && <X onClick={handlePointDelete} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className={styles.error}>{errorMessage}</p>
        <div className={styles.footer}>
          <p
            className={styles.cancel}
            onClick={() => (props.onClose ? props.onClose() : "")}
          >
            Cancel
          </p>
          <button
            className="button"
            onClick={handleSubmission}
            disabled={submitButtonDisabled}
          >
            Submit
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ProjectForm;
