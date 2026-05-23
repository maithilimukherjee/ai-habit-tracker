function Dashboard() {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div
      style={{
        color: "white",
        padding: "40px"
      }}
    >

      <h1>
        welcome back, {user?.name}!
      </h1>

    </div>
  );
}

export default Dashboard;