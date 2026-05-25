import { render, screen, fireEvent } from "@testing-library/react"
import { AuthProvider, useAuth } from "@/providers/auth-provider"

function Probe() {
  const { isAuthenticated, login, logout } = useAuth()
  return (
    <div>
      <span data-testid="auth-state">{String(isAuthenticated)}</span>
      <button onClick={() => login("token-test")}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  )
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "http://localhost/", assign: vi.fn() },
    })
  })

  it("sets authenticated state after login", () => {
    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    )
    fireEvent.click(screen.getByText("login"))
    expect(localStorage.getItem("token")).toBe("token-test")
    expect(screen.getByTestId("auth-state")).toHaveTextContent("true")
  })
})
