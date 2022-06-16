import React, { useEffect, useState } from "react";
import designIcon from "../../assets/designer.svg";
import { ArrowRight } from "react-feather";
import { useNavigate } from "react-router-dom";

import styles from "./Home.module.css";
import { getAllProjects } from "../../firebase";
import Spinner from "../Spinner/Spinner";
import ProjectModal from "./ProjectModal/ProjectModal";

function Home(props) {
  const navigate = useNavigate();
  const isAuthenticated = props.auth ? true : false;

  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});

  const handleNextButtonClick = () => {
    if (isAuthenticated) navigate("/account");
    else navigate("/login");
  };

  const fetchAllProjects = async () => {
    const result = await getAllProjects();
    setProjectsLoaded(true);
    if (!result) {
      return;
    }

    const tempProjects = [];
    result.forEach((doc) => tempProjects.push({ ...doc.data(), pid: doc.id }));

    setProjects(tempProjects);
  };

  const handleProjectCardClick = (project) => {
    setShowProjectModal(true);
    setProjectDetails(project);
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);

  return (
    <div className={styles.container}>
      {showProjectModal && (
        <ProjectModal
          onClose={() => setShowProjectModal(false)}
          details={projectDetails}
        />
      )}
      <div className={styles.header}>
        <div className={styles.left}>
          <p className={styles.heading}>Projects Store</p>
          <p className={styles.subHeading}>
            Store the information of all the software projects at one place
          </p>
          <button onClick={handleNextButtonClick} className={styles.button}>
            {isAuthenticated ? "Manage Your Projects" : "Get Started"}
            {""}
            <ArrowRight />
            {""}
          </button>
        </div>
        <div className={styles.right}>
          <img src={designIcon} alt="Projects" />
        </div>
      </div>
      <div className={styles.body}>
        <p className={styles.title}>All Projects</p>
        <div className={styles.projects}>
          {projectsLoaded ? (
            projects.length > 0 ? (
              projects.map((item) => (
                <div
                  className={styles.project}
                  key={item.pid}
                  onClick={() => handleProjectCardClick(item)}
                >
                  <div className={styles.image}>
                    <img
                      src={
                        item.thumbnail ||
                        "https://avatarfiles.alphacoders.com/131/131347.jpg"
                      }
                      alt="Project Thumbnail"
                    />
                  </div>
                  <p className={styles.title}>{item.title}</p>
                </div>
              ))
            ) : (
              <p>No projects to show</p>
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
