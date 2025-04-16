import { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  points: number;
  role: string;
}

const Leaderboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Nincs hitelesítési token.");
        }

        const roleResponse = await fetch("http://localhost:3000/auth/role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (roleResponse.ok) {
          const { role } = await roleResponse.json();
          setIsAdmin(role === "ADMIN");
        }

        const response = await fetch("http://localhost:3000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Nem sikerült betölteni a ranglistát.");
        }

        const data: User[] = await response.json();
        setUsers(data);
      } catch (err) {
        setError("Nem sikerült betölteni a ranglistát.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleDelete = async (userId: number) => {
    const userToDelete = users.find((user) => user.id === userId);

    if (userToDelete?.role === "ADMIN") {
      alert("Nem törölheted az adminisztrátort!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Nincs hitelesítési token.");
      }

      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Nem sikerült törölni a felhasználót.");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      alert("Nem sikerült törölni a felhasználót.");
    }
  };

  if (loading) {
    return <p>Ranglista betöltése...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <div className="container">
      <h1>Ranglista</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Hely</th>
            <th>Felhasználónév</th>
            <th>Pontszám</th>
            {isAdmin && <th>Műveletek</th>} {}
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.points}</td>
              {isAdmin && (
                <td>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                  >
                    Törlés
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
