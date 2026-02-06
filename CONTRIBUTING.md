# Contributing to Calendar Syncer

Thank you for your interest in contributing to Calendar Syncer! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites
1. Ensure you have read the [README.md](README.md) and [SETUP.md](SETUP.md)
2. Set up your development environment following the setup guide
3. Familiarize yourself with the [ARCHITECTURE.md](ARCHITECTURE.md)

### Finding Issues to Work On
- Check the [Issues](../../issues) page for open issues
- Look for issues labeled `good first issue` for newcomers
- Issues labeled `help wanted` are actively seeking contributors
- Comment on an issue to express your interest before starting work

### Forking the Repository
1. Fork the repository to your GitHub account
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/calendarsyncer.git
   cd calendarsyncer
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/ikyorince101/calendarsyncer.git
   ```

## Development Process

### Setting Up Your Development Environment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create a new branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
   
   Branch naming conventions:
   - `feature/` - New features
   - `fix/` - Bug fixes
   - `docs/` - Documentation changes
   - `refactor/` - Code refactoring
   - `test/` - Test additions or changes

3. **Start the development server:**
   ```bash
   npm start
   ```

### Making Changes

1. **Write clean, readable code**
   - Follow the existing code style
   - Add comments for complex logic
   - Keep functions small and focused

2. **Test your changes**
   - Write unit tests for new functionality
   - Ensure existing tests pass
   - Test on multiple platforms if possible (iOS, Android, Web)

3. **Update documentation**
   - Update README.md if you change functionality
   - Add JSDoc comments to new functions
   - Update API.md if you change APIs

### Committing Your Changes

1. **Stage your changes:**
   ```bash
   git add .
   ```

2. **Commit with a descriptive message:**
   ```bash
   git commit -m "feat: add event filtering by source"
   ```
   
   Commit message format:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Test additions or changes
   - `chore:` - Maintenance tasks

3. **Keep commits focused:**
   - One commit per logical change
   - Avoid mixing multiple unrelated changes

## Pull Request Process

### Before Submitting

1. **Update your branch with latest upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests:**
   ```bash
   npm test
   ```

3. **Run linting:**
   ```bash
   npm run lint
   ```

4. **Build the project:**
   ```bash
   npm run build:web
   ```

### Submitting a Pull Request

1. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request:**
   - Go to GitHub and create a PR from your branch
   - Fill in the PR template completely
   - Link related issues using keywords (fixes #123, closes #456)

3. **PR Title Format:**
   - Use the same format as commit messages
   - Example: `feat: add event filtering by source`

4. **PR Description Should Include:**
   - What changes were made
   - Why the changes were made
   - How to test the changes
   - Screenshots (for UI changes)
   - Related issues

### Review Process

1. **Code Review:**
   - Maintainers will review your PR
   - Address feedback and comments
   - Make requested changes and push updates

2. **CI Checks:**
   - Ensure all automated checks pass
   - Fix any failing tests or linting issues

3. **Approval:**
   - Once approved, a maintainer will merge your PR
   - Your contribution will be included in the next release

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` type
- Use ES6+ features

```typescript
// Good
interface EventProps {
  event: CalendarEvent;
  onPress: () => void;
}

// Avoid
const props: any = { ... };
```

### React/React Native

- Use functional components with hooks
- Follow React best practices
- Avoid unnecessary re-renders

```typescript
// Good
const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);
  
  return <View>{/* Component JSX */}</View>;
};

// Avoid class components for new code
```

### Naming Conventions

- **Components**: PascalCase (`EventCard.tsx`)
- **Functions/Variables**: camelCase (`fetchEvents`, `eventList`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces/Types**: PascalCase (`CalendarEvent`)
- **Files**: PascalCase for components, camelCase for utilities

### Code Organization

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── services/       # API and external services
├── context/        # React context providers
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

### Comments and Documentation

```typescript
/**
 * Fetches calendar events from Google Calendar API
 * @param account - The calendar account to fetch events from
 * @returns Promise resolving to array of calendar events
 * @throws Error if authentication fails
 */
async function fetchEvents(account: CalendarAccount): Promise<CalendarEvent[]> {
  // Implementation
}
```

## Testing Guidelines

### Unit Tests

- Write tests for all new functions
- Test edge cases and error conditions
- Use descriptive test names

```typescript
describe('EmailParser', () => {
  it('should extract event from email with clear date and time', () => {
    // Test implementation
  });
  
  it('should handle emails without dates', () => {
    // Test implementation
  });
});
```

### Test Coverage

- Aim for at least 80% code coverage
- Focus on critical paths
- Don't sacrifice quality for coverage numbers

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Documentation

### Code Documentation

- Add JSDoc comments to all public functions
- Document complex algorithms
- Explain "why" not just "what"

### README Updates

- Update README.md for new features
- Add usage examples
- Update installation instructions if needed

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error conditions

## Common Tasks

### Adding a New Feature

1. Create a new branch
2. Implement the feature
3. Write tests
4. Update documentation
5. Submit PR

### Fixing a Bug

1. Create a new branch
2. Write a test that reproduces the bug
3. Fix the bug
4. Verify the test passes
5. Submit PR

### Improving Documentation

1. Create a new branch
2. Make documentation changes
3. Review for clarity and accuracy
4. Submit PR

## Questions?

- Open an issue for questions
- Check existing documentation
- Review closed issues and PRs
- Ask in PR comments

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for contributing to Calendar Syncer! 🎉
