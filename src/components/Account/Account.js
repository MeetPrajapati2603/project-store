import React, { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { Camera, Edit2, GitHub, LogOut, Paperclip, Trash } from "react-feather";
import { Link, Navigate, useNavigate } from "react-router-dom";
import InputControl from "../InputControl/InputControl";
import styles from "./Account.module.css";
import ProjectForm from "./ProjectForm/ProjectForm";
import Spinner from "../../components/Spinner/Spinner";

import {
  auth,
  uploadImage,
  updateUserDatabase,
  getAllProjectsForUser,
  deleteProject,
} from "../../firebase";


function Account(props) {

  const navigate = useNavigate();

  const userDetails = props.userDetails;
  const isAuthenticated = props.auth;
  const imagePicker = useRef();

  const [progress, setProgress] = useState(0);
  const [profileImageUploadStarted, setProfileImageUploadStarted] =
    useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(userDetails.profileImage ||
    "https://avatarfiles.alphacoders.com/131/131347.jpg"
  );

  const [userProfileValues, setUserProfileValues] = useState({
    name: userDetails.name || "",
    designation: userDetails.designation || "",
    github: userDetails.github || "",
    linkedin: userDetails.linkedin || "",
  });

  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [showSaveDetailsButton, setShowSaveDetailsButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isEditProjectModal, setIsEditProjectModal] = useState(false);
  const [editProject, setEditProject] = useState({});

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleCameraClick = () => {
    imagePicker.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setProfileImageUploadStarted(true);
    uploadImage(
      file,
      (progress) => {
        setProgress(progress);
      },
      (url) => {
        setProfileImageUrl(url);
        updateProfileImageToDatabase(url);
        setProfileImageUploadStarted(false);
        setProgress(0);
      },
      (err) => {
        console.log("Error->", err);
        setProfileImageUploadStarted(false);
      }
    );
  };

  const updateProfileImageToDatabase = (url) => {
    updateUserDatabase(
      { ...userProfileValues, profileImage: url },
      userDetails.uid
    );
  };

  const handleInputChange = (event, property) => {
    setShowSaveDetailsButton(true);

    setUserProfileValues((prev) => ({
      ...prev,
      [property]: event.target.value,
    }));
  };

  const saveDetailsToDatabase = async () => {
    if (!userProfileValues.name) {
      setErrorMessage("Name required");
      return;
    }

    setSaveButtonDisabled(true);
    await updateUserDatabase({ ...userProfileValues }, userDetails.uid);
    setSaveButtonDisabled(false);
    setShowSaveDetailsButton(false);
  };

  const fetchAllProjects = async () => {
    const result = await getAllProjectsForUser(userDetails.uid);
    if (!result) {
      setProjectsLoaded(true);
      return;
    }
    setProjectsLoaded(true);

    let tempProjects = [];
    result.forEach((doc) => tempProjects.push({ ...doc.data(), pid: doc.id }));
    setProjects(tempProjects);
  };

  const handleEditClick = (project) => {
    setIsEditProjectModal(true);
    setEditProject(project);
    setShowProjectForm(true);
  };

  const handleDeletion = async (pid) => {
    await deleteProject(pid);
    fetchAllProjects();
  };

  const handleHomeButton = () => {
    navigate("/");
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  return isAuthenticated ? (
    <div className={styles.container}>
      {showProjectForm && (
        <ProjectForm
          onClose={() => setShowProjectForm(false)}
          onSubmission={fetchAllProjects}
          uid={userDetails.uid}
          isEdit={isEditProjectModal}
          default={editProject}
        />
      )}
      <div className={styles.header}>
        <p className={styles.heading} onClick={handleHomeButton} style={{cursor:"pointer"}}>
          Welcome<span> {userProfileValues.name} </span>
        </p>

        <div className={styles.logout} onClick={handleLogout}>
          <LogOut /> Logout
        </div>
      </div>
      <input
        ref={imagePicker}
        type="file"
        style={{ display: "none" }}
        onChange={handleImageChange}
      />
      <div className={styles.section}>
        <div className={styles.title}>Your Profile</div>
        <div className={styles.profile}>
          <div className={styles.left}>
            <div className={styles.image}>
              <img src={profileImageUrl} alt="Profile Pic" />
              <div className={styles.camera} onClick={handleCameraClick}>
                <Camera />
              </div>
            </div>
            {profileImageUploadStarted ? (
              <p className={styles.progess}>
                {progress === 100
                  ? "Getting image url..."
                  : `${progress.toFixed(2)}% uploaded`}
              </p>
            ) : (
              ""
            )}
          </div>
          <div className={styles.right}>
            <div className={styles.row}>
              <InputControl
                Label="Name"
                placeholder="Enter your name"
                value={userProfileValues.name}
                onChange={(event) => handleInputChange(event, "name")}
              />
              <InputControl
                Label="Title"
                placeholder="eg. Data Analyst"
                value={userProfileValues.designation}
                onChange={(event) => handleInputChange(event, "designation")}
              />
            </div>
            <div className={styles.row}>
              <InputControl
                Label="GitHub"
                placeholder="Enter you GitHub Id"
                value={userProfileValues.github}
                onChange={(event) => handleInputChange(event, "github")}
              />
              <InputControl
                Label="LinkedIn"
                placeholder="Enter your linkedIn link"
                value={userProfileValues.linkedin}
                onChange={(event) => handleInputChange(event, "linkedin")}
              />
            </div>
            <div className={styles.footer}>
              <p className={styles.error}>{errorMessage}</p>
              {showSaveDetailsButton && (
                <button
                  className={styles.saveButton}
                  disabled={saveButtonDisabled}
                  onClick={saveDetailsToDatabase}
                >
                  Save Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className={styles.section}>
        <div className={styles.projectsHeader}>
          <div className={styles.title}>Your Projects</div>
          <button className="button" onClick={() => setShowProjectForm(true)}>
            Add Projects
          </button>
        </div>
        <div className={styles.projects}>
          {projectsLoaded ? (
            projects.length > 0 ? (
              projects.map((item, index) => (
                <div className={styles.project} key={item.title + index}>
                  <p className={styles.title}>{item.title}</p>

                  <div className={styles.links}>
                    <Edit2 onClick={() => handleEditClick(item)} />
                    <Trash onClick={() => handleDeletion(item.pid)} />
                    <Link target="_blank" to={`//${item.github}`}>
                      <GitHub />
                    </Link>
                    {item.link ? (
                      <Link target="_blank" to={`//${item.link}`}>
                        <Paperclip />
                      </Link>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No projects found</p>
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
}

export default Account;
