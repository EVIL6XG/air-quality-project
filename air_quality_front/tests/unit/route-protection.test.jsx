import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import App from "@/App"

vi.mock("@/providers/auth-provider", () => ({
  useAuth: () => ({ isAuthenticated: false }),
}))

describe("Route protection", () => {
  it("redirects guest from dashboard to login page", async () => {
    const queryClient = new QueryClient()
    window.history.pushState({}, "", "/dashboard")
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    )
    expect(await screen.findByPlaceholderText("Email address")).toBeInTheDocument()
  })
})
