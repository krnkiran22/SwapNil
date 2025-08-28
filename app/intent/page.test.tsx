const { render, screen } = require('@testing-library/react');
const Page = require('../page');

test('renders page component', () => {
    render(<Page />);
    const linkElement = screen.getByText(/some text/i);
    expect(linkElement).toBeInTheDocument();
});