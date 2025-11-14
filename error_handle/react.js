const { useEffect } = require("react");

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users/9999")
        if (!res.ok) {
          throw new Error("http error: ", res.status)
        }

        const data = await res.json()

        if (!data.name) {
          throw new Error("유효하지 않은 사용자")
        }

        setUser(data)
      } catch (error) {
        serError(error.message)
      }
    }

    loadUser()
  }, [])

  if (error) return <p>X 에러: {error}</p>
  if (!user) return null
  return <p>Hi, {user.name}!</p>
}