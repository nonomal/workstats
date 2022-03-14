import { render } from '@testing-library/react'
import Home from '../pages/index'

// Optionally, added a snapshot test to keep track of any unexpected changes to your <Home /> component:
it('renders homepage unchanged', () => {
  const { container } = render(<Home />)
  expect(container).toMatchSnapshot()
})