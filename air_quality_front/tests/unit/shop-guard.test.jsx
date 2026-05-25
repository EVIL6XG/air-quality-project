import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import ShopPage from "@/pages/ShopPage"

const mutateSpy = vi.fn()

vi.mock("@/providers/auth-provider", () => ({
  useAuth: () => ({ isAuthenticated: false }),
}))

vi.mock("@/features/shop/queries", () => ({
  useAddToCart: () => ({ mutate: mutateSpy, isPending: false }),
}))

describe("Shop auth guard", () => {
  beforeEach(() => {
    mutateSpy.mockClear()
  })

  it("shows sign-in dialog and does not call add-to-cart for guest", async () => {
    render(
      <MemoryRouter>
        <ShopPage />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getAllByText("Add to cart")[0])

    expect(await screen.findByText("Sign in required")).toBeInTheDocument()
    expect(mutateSpy).not.toHaveBeenCalled()
  })
})
