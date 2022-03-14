import { render, screen } from '@testing-library/react'
import Home from '../pages/index'

// For example, we can add a test to check if the <Home /> component successfully renders a heading:
describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /welcome to next\.js!/i,
    })

    expect(heading).toBeInTheDocument()
  })
})