/**
 * Content backing the blog, tutorial and community detail pages.
 *
 * The listing pages link to these slugs. Before this module existed the
 * destinations were never implemented, so every "Read More" produced a 404.
 */

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author: string;
  category: BlogCategory;
  categoryLabel: string;
  tags: string[];
  body: string[];
}

export type BlogCategory = 'tutorials' | 'technical' | 'company' | 'community';

export const blogCategories: {
  slug: BlogCategory;
  name: string;
  description: string;
}[] = [
  { slug: 'tutorials', name: 'Tutorials', description: 'Step-by-step guides and how-tos' },
  { slug: 'technical', name: 'Technical', description: 'Deep technical insights and analysis' },
  { slug: 'company', name: 'Company', description: 'Updates and behind-the-scenes stories' },
  { slug: 'community', name: 'Community', description: 'User stories and community highlights' },
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-hackforge-generates-clean-code',
    title: 'How HackForge Generates Clean, Maintainable Code',
    excerpt:
      'Discover the engineering principles and AI techniques that enable HackForge to generate production-ready code that follows best practices and industry standards.',
    date: 'Dec 15, 2024',
    readTime: '8 min read',
    author: 'Sarah Chen',
    category: 'technical',
    categoryLabel: 'Featured',
    tags: ['AI Engineering', 'Code Quality', 'Best Practices'],
    body: [
      'Generating code that runs is the easy part. Generating code a team can still maintain six months later is the actual problem, and it is the one HackForge is built around.',
      'Every generation starts with a system prompt that pins down the non-negotiables: explicit error handling, no silent catch blocks, meaningful names, and comments that explain intent rather than restating the syntax. The user prompt is appended to that instruction rather than replacing it, so a vague request still produces structured output.',
      'The request is sent to Grok with a deliberately moderate temperature. Higher values produce more inventive code and considerably more hallucinated APIs. Around 0.7 the model stays creative on structure while remaining conservative about the libraries it reaches for.',
      'Output is capped at a token budget large enough for multi-file scaffolds. When a response is truncated the backend detects the length finish reason and surfaces a warning rather than handing back a file that stops halfway through a function.',
      'Finally, the generated source can be run through a formatting and linting pass before it reaches the editor. Formatting removes the stylistic noise that makes AI output feel foreign, and linting catches the small set of mistakes language models still make reliably: unused bindings, unreachable branches, and unsafe dynamic evaluation.',
      'None of this makes generated code correct by construction. It makes it reviewable, which is the property that actually matters when the code lands in a real repository.',
    ],
  },
  {
    slug: 'ai-development-trends-2025',
    title: 'Top 5 AI-Powered Development Trends in 2025',
    excerpt:
      'Explore the most impactful AI development trends that will shape the future of software engineering and how HackForge is positioned to help developers stay ahead.',
    date: 'Dec 12, 2024',
    readTime: '6 min read',
    author: 'HackForge Team',
    category: 'technical',
    categoryLabel: 'Trending',
    tags: ['AI Trends', '2025'],
    body: [
      'The gap between "AI writes a snippet" and "AI participates in engineering" closed faster than most teams planned for. Five shifts stand out.',
      'First, scaffolding moved from files to projects. Developers no longer ask for a single component; they ask for a working slice of an application, with routing, state, and data access already wired together.',
      'Second, review became the bottleneck. When generation is cheap, the scarce resource is the attention required to verify the output. Tooling that makes generated code easier to read pays for itself immediately.',
      'Third, prompts started living in version control. Teams that treat prompts as disposable chat messages keep re-deriving the same context. Teams that commit them get reproducible generation.',
      'Fourth, models became a dependency with an SLA. Rate limits, quota exhaustion and safety refusals are now ordinary production failure modes that need real error handling rather than a generic try/catch.',
      'Fifth, the interesting work moved up the stack. Deciding what to build, and judging whether the generated answer is right, is still entirely human.',
    ],
  },
  {
    slug: 'road-to-launch',
    title: 'Behind the Scenes: Our Road to Launch',
    excerpt:
      'Take a deep dive into the development journey of HackForge, from initial concept to public launch, including the challenges, breakthroughs, and lessons learned.',
    date: 'Dec 10, 2024',
    readTime: '12 min read',
    author: 'HackForge Team',
    category: 'company',
    categoryLabel: 'Behind the Scenes',
    tags: ['Company', 'Launch'],
    body: [
      'HackForge started as a weekend experiment: could a prompt produce a project skeleton good enough to actually keep working in?',
      'The first prototype was a single text box and a raw model response rendered into a <pre> tag. It demonstrated the idea and nothing else. There was no way to edit the result, no way to keep it, and no way to tell whether the output had been truncated.',
      'The architecture settled into two processes fairly quickly. A Next.js frontend owns the interface and the editing experience; an Express backend owns the model calls, rate limiting, and persistence. Keeping the API key server-side was the non-negotiable constraint that forced the split.',
      'The hardest problems were unglamorous. Handling a truncated model response. Making the dashboard survive a backend that is not running. Ensuring a missing environment variable produced a clear message instead of a request to a URL beginning with the word "undefined".',
      'The lesson that generalises: the demo is the first ten percent. The remaining ninety is everything that happens when a dependency is missing, slow, or wrong.',
    ],
  },
  {
    slug: 'real-time-chat-app-tutorial',
    title: 'Building a Real-Time Chat App with HackForge',
    excerpt:
      "Step-by-step guide to creating a modern real-time chat application using HackForge's AI-powered code generation and WebSocket integration.",
    date: 'Dec 8, 2024',
    readTime: '15 min read',
    author: 'HackForge Team',
    category: 'tutorials',
    categoryLabel: 'Tutorial',
    tags: ['Tutorial', 'Real-time'],
    body: [
      'Real-time features are a good stress test for code generation because they span the client, the server, and the connection lifecycle between them.',
      'Start by generating the data model rather than the UI. Ask for the message and room shapes first, including timestamps and sender identity. Every later prompt can then refer back to a fixed vocabulary.',
      'Generate the server next. Be explicit that you want connection, disconnection, and reconnection handled, and that broadcasts must be scoped to a room rather than sent to every connected socket.',
      'Only then generate the interface. Ask for an optimistic send: the message appears immediately and is reconciled when the server acknowledges it. This is the detail most generated chat UIs omit, and it is the one users notice.',
      'Finish by asking specifically for cleanup — listeners removed on unmount, timers cleared, sockets closed. Memory leaks in real-time UIs are almost always missing teardown.',
    ],
  },
  {
    slug: 'saas-platform-48-hours',
    title: 'How We Built a SaaS Platform in 48 Hours',
    excerpt:
      'Real-world case study of building a complete SaaS platform using HackForge, including the development process, challenges, and results.',
    date: 'Dec 5, 2024',
    readTime: '10 min read',
    author: 'HackForge Team',
    category: 'community',
    categoryLabel: 'Case Study',
    tags: ['Case Study', 'SaaS'],
    body: [
      'Forty-eight hours is enough time to build a working product only if you refuse to make decisions twice.',
      'The stack was fixed before the clock started: Next.js, an Express API, MongoDB. Generation was used for the repetitive surface area — forms, tables, CRUD handlers, validation — and avoided entirely for billing logic.',
      'The single largest time saving was not writing code faster. It was skipping the blank-page problem. A generated first draft, even a mediocre one, converts an open-ended design question into a concrete editing task.',
      'The largest time loss was accepting generated code without reading it. Two hours went into debugging a data-fetching effect that re-ran on every render because nobody checked the dependency array.',
      'Net result: a working platform, and a firm rule that generated code goes through the same review as handwritten code.',
    ],
  },
  {
    slug: 'optimizing-ai-generated-code',
    title: 'Optimizing AI-Generated Code for Performance',
    excerpt:
      'Learn advanced techniques for optimizing AI-generated code, including performance profiling, memory management, and best practices for production deployment.',
    date: 'Dec 3, 2024',
    readTime: '18 min read',
    author: 'HackForge Team',
    category: 'technical',
    categoryLabel: 'Technical',
    tags: ['Performance', 'Optimization'],
    body: [
      'Generated code is usually correct before it is fast. The performance problems it introduces are predictable enough to check for systematically.',
      'The most common issue in generated React is an unstable dependency. An object or array rebuilt during render is a new reference every time, so any effect depending on it runs on every render. Memoise the value, or depend on the primitive it derives from.',
      'The second is unbatched network work. Generated list views frequently fetch per item. Ask explicitly for a single request with pagination.',
      'The third is missing cleanup. Intervals, subscriptions and observers are created readily and torn down rarely. Every effect that starts something must return a function that stops it.',
      'Measure before rewriting. Profiling repeatedly shows the expensive part is not where the generated code looks ugliest.',
    ],
  },
  {
    slug: 'community-spotlight',
    title: 'Community Spotlight: Amazing Projects Built with HackForge',
    excerpt:
      "Discover incredible projects built by the HackForge community, from innovative web apps to game-changing tools that demonstrate the platform's versatility.",
    date: 'Dec 1, 2024',
    readTime: '7 min read',
    author: 'HackForge Team',
    category: 'community',
    categoryLabel: 'Community',
    tags: ['Community', 'Showcase'],
    body: [
      'The most interesting thing about a code generator is what people point it at once it stops being a novelty.',
      'A recurring pattern is internal tooling: dashboards, admin panels and data viewers that were always worth having and never worth a sprint. Generation moves them below the threshold where they get skipped.',
      'Another is teaching. Several contributors use generated projects as reading material, asking for the same application twice with different constraints and comparing the results.',
      'The projects that hold up longest share a habit — the author treated the generated output as a starting draft, read it end to end, and rewrote the parts that did not fit.',
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category);
}

export interface Tutorial {
  slug: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  steps: { heading: string; detail: string }[];
}

export const tutorials: Tutorial[] = [
  {
    slug: 'beginner/idea-to-app',
    title: 'From Idea to App in 10 Minutes',
    description:
      'Learn the fundamentals of HackForge by building a simple todo application from scratch. This tutorial covers the basics of prompt engineering, project structure, and deployment.',
    level: 'Beginner',
    duration: '10 minutes',
    steps: [
      {
        heading: 'Start both servers',
        detail:
          'Run npm run backend:dev and npm run dev in separate terminals, then open http://localhost:3000. Check http://localhost:5002/health first — services.grok must be true.',
      },
      {
        heading: 'Describe the application, not the code',
        detail:
          'On the Generate page, describe behaviour rather than implementation: what the user sees, what they can do, and what should persist between visits.',
      },
      {
        heading: 'Pick a tech stack',
        detail:
          'The stack selector is appended to your prompt. Choosing Full-Stack (Auto) lets the model decide, which is useful when you do not have a strong preference.',
      },
      {
        heading: 'Read the result before editing',
        detail:
          'Generated files open in the editor on the right. Read the whole file once before changing anything — it is faster than debugging an assumption later.',
      },
      {
        heading: 'Save and export',
        detail:
          'Save the project to your dashboard, then export the files as a ZIP when you are ready to keep working locally.',
      },
    ],
  },
  {
    slug: 'beginner/first-component',
    title: 'Your First AI-Generated Component',
    description:
      'Understand how to create reusable UI components using natural language descriptions. Learn best practices for component generation and customization.',
    level: 'Beginner',
    duration: '15 minutes',
    steps: [
      {
        heading: 'Name the props first',
        detail:
          'State the component name and its inputs explicitly. "A Card component taking title, description and an optional badge" generates far more predictable output than "a nice card".',
      },
      {
        heading: 'Describe states, not just appearance',
        detail:
          'Loading, empty, error and disabled states are usually omitted unless you ask for them. Listing them turns one prompt into a complete component.',
      },
      {
        heading: 'Constrain the styling system',
        detail:
          'Say which styling approach to use. Without that instruction the model will pick one, and it may not match the rest of your project.',
      },
      {
        heading: 'Iterate in small edits',
        detail:
          'Change one thing per follow-up prompt. Large rewrites tend to discard details you liked in the previous version.',
      },
    ],
  },
  {
    slug: 'intermediate/custom-templates',
    title: 'Custom Templates for Faster Development',
    description:
      'Create your own code templates to speed up development workflows. Learn template syntax, variables, and how to share templates with your team.',
    level: 'Intermediate',
    duration: '25 minutes',
    steps: [
      {
        heading: 'Start from a prompt that already works',
        detail:
          'The best templates are extracted from real prompts you have used more than once, not written speculatively.',
      },
      {
        heading: 'Separate the fixed part from the variable part',
        detail:
          'Conventions, stack and quality requirements are fixed. The feature description is variable. Keeping them apart is what makes a template reusable.',
      },
      {
        heading: 'Encode your conventions',
        detail:
          'Folder layout, naming, and error-handling expectations belong in the template so every generation lands consistently.',
      },
      {
        heading: 'Share and version them',
        detail:
          "Templates that live in the repository stay current. Templates that live in someone's chat history do not.",
      },
    ],
  },
  {
    slug: 'intermediate/full-stack-apps',
    title: 'Building Full-Stack Applications',
    description:
      'Learn to generate complete applications with frontend, backend, and database integration. Master the art of full-stack development with AI assistance.',
    level: 'Intermediate',
    duration: '45 minutes',
    steps: [
      {
        heading: 'Generate the schema first',
        detail:
          'Data shape decides everything downstream. Fix it before generating handlers or interface code so later prompts share a vocabulary.',
      },
      {
        heading: 'Then the API surface',
        detail:
          'List the endpoints with their methods, inputs and error cases. Ask for validation explicitly — it is skipped by default.',
      },
      {
        heading: 'Then the interface',
        detail:
          'Reference the endpoints you generated by name so the client and server agree on payload shapes.',
      },
      {
        heading: 'Ask for the failure paths',
        detail:
          'Request loading and error states, request timeouts, and behaviour when the backend is unreachable. This is the difference between a demo and an application.',
      },
    ],
  },
  {
    slug: 'advanced/ci-cd-integration',
    title: 'Integrating HackForge into Your CI/CD Pipeline',
    description:
      'Automate your development workflow by integrating HackForge into CI/CD pipelines. Learn to generate code automatically on pull requests, deploy previews, and maintain code quality.',
    level: 'Advanced',
    duration: '60 minutes',
    steps: [
      {
        heading: 'Treat generation as a build step, not a chat',
        detail:
          'Call the /api/generate endpoint from your pipeline with a committed prompt file so runs are reproducible.',
      },
      {
        heading: 'Budget for rate limits',
        detail:
          'Generation is limited to ten requests per fifteen minutes. A pipeline that generates per-commit will hit that ceiling; cache aggressively.',
      },
      {
        heading: 'Gate on the same checks as handwritten code',
        detail:
          'Type-check, lint and test generated output before it merges. Generated code that skips CI is how unreviewed code reaches production.',
      },
      {
        heading: 'Keep secrets server-side',
        detail:
          'The Grok key belongs to the backend service only. Anything prefixed NEXT_PUBLIC_ is compiled into the browser bundle and is not a secret.',
      },
    ],
  },
];

export interface LearningPath {
  slug: string;
  title: string;
  description: string;
  modules: string[];
}

export const learningPaths: LearningPath[] = [
  {
    slug: 'paths/frontend',
    title: 'Frontend Developer',
    description:
      'Build interfaces with generated components, state management and styling that match your existing conventions.',
    modules: [
      'Generating your first component',
      'Describing states: loading, empty and error',
      'Keeping generated styling consistent',
      'Forms, validation and accessibility',
      'Optimising re-renders in generated React',
    ],
  },
  {
    slug: 'paths/backend',
    title: 'Backend Developer',
    description:
      'Generate APIs, data models and persistence layers, then harden them for production traffic.',
    modules: [
      'Modelling your data before writing endpoints',
      'Generating CRUD handlers with real validation',
      'Error shapes and status codes that clients can use',
      'Rate limiting and caching',
      'Health checks and operational visibility',
    ],
  },
  {
    slug: 'paths/fullstack',
    title: 'Full-Stack Developer',
    description:
      'Take a feature from schema to deployed interface, keeping both halves of the stack in agreement.',
    modules: [
      'Schema-first generation',
      'Designing the API surface',
      'Wiring the client to the endpoints',
      'Handling an unreachable backend gracefully',
      'Deploying frontend and backend as separate services',
    ],
  },
];

export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return tutorials.find((tutorial) => tutorial.slug === slug);
}

export function getPathBySlug(slug: string): LearningPath | undefined {
  return learningPaths.find((path) => path.slug === slug);
}
