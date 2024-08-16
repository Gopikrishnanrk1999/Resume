export const summaryText =
  "As a Software Developer with over 2 years of experience, I've specialized in managing web applications using React JS. I focus on translating complex business needs into efficient code. My skills go beyond coding; I excel in project and time management, as well as communication. I'm passionate about writing clean, reusable code and staying updated with new technologies.";

export const skills = [
  { techName: 'JavaScript' },
  { techName: 'React' },
  { techName: 'Vue' },
  { techName: 'Redux' },
  { techName: 'Zustand' },
  { techName: 'Bootstrap' },
  { techName: 'MUI' },
  { techName: 'Git' },
  { techName: 'Stripe Integration' },
];

export const projects = [
  {
    title: 'ORMA PROJECT',
    url: 'https://www.orma.app',
    desc: `The project encompasses distinct administrative and user interfaces. The administrative interface facilitates the management
of user payments, user accounts, and website links, while the user interface allows users to select their preferred plan.`,
    technologies: ['React', 'Redux', 'Stripe'],
    points: [
      'Utilized Redux for state management, enabling predictable and efficient state handling.',
      'Integrated Apple Pay,Google pay and card payments, using Stripe, improving transaction efficiency and user experience',
      'Managed VIP user roles, handling specific requirements and privileges for enhanced user differentiation.',
      'Implemented the profile details section, ensuring accurate user information management.',
      'Developed a transaction list page, including functionality for invoice downloads to improve user transaction tracking.',
    ],
  },
  {
    title: `ENTERPRISE RESOURCE PLANNING (ERP) TOOL`,
    url: '',
    desc: `An ERP tool designed to manage employees, interviews, leaves, and other HR-related tasks.
`,
    technologies: ['React', 'Zustand', 'Bootstrap'],
    points: [
      'Oversaw the Interview section, including the administration of interview processes and result management.',
      'Implemented a comprehensive permission module to control access and enhance security across the project.',
      'Managed the asset module, overseeing asset allocation and optimizing asset tracking processes.',
      'Leveraged Zustand for state management, ensuring efficient and scalable application state handling.',
    ],
  },
  {
    title: `HERO'S SAVINGS VAULT`,
    url: 'https://herossavingsvault.com',
    desc: `Hero's Savings Vault provides a robust administrative interface for managing customer accounts and implementing exclusive offers and
partnerships for military personnel. It serves as a dedicated platform for current and former military employees to access savings opportunities`,
    technologies: ['React', 'Redux'],
    points: [
      'Worked on the login page and admin profile view.',
      'Completed the initial setup of the project, including routing and layout settings.',
      'Created common listing components and a common modal structure.',
    ],
  },
  {
    title: `PROPOSAL MANAGEMENT TOOL`,
    url: '',
    desc: `The Proposal Management Tool enhances the efficiency of project proposal creation by providing advanced features for
editing each project feature. Additionally, it empowers users with the capability to generate downloadable final documents in
PDF format`,
    technologies: ['React', 'Redux'],
    points: [
      `Established a connection with the project management tool. Each feature from a proposal,
along with its technology category and estimation hours, was added to the project
management tool as a ticket.`,
      'Implemented proposal feature editing, including moving features between modules and adjusting estimation hours.',
    ],
  },
  {
    title: `VISION TRADING APP`,
    url: '',
    desc: `Vision is a trading assistance platform which fetches data from polygon.io to plot charts using svg rendering.
Users can draw shapes and tools on the chart for better understanding about the chart trends
`,
    technologies: ['React', 'Redux'],
    points: [
      'Added infinity scroll functionality for stock searches, allowing for continuous data fetching and storage.',
      'Conducted research and development on Renko chart types.',
      'Addressed bug fixes, including issues with displaying invalid chat times and the color picker.',
    ],
  },
];
