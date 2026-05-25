import "../../styles/profileSidebar.css";

function ProfileSidebar({
  user,
  isOpen,
  onClose
}) {

  if (!isOpen) return null;

  const handleLogout = () => {

    localStorage.removeItem("token");
    window.location.href = "/";

  };

  return (

    <>

      <div
        className="profile-overlay"
        onClick={onClose}
      />

      <div className="profile-sidebar">

        <div className="profile-header">

          <h2>profile</h2>

          <button
            className="close-profile"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <div className="profile-content">

          <img
            src={user?.avatar}
            alt="avatar"
            className="profile-avatar"
          />

          <h3>
            {user?.name}
          </h3>

          <p>
            {user?.email}
          </p>

          <div className="profile-divider" />


          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            logout
          </button>

        </div>

      </div>

    </>

  );
}

export default ProfileSidebar;