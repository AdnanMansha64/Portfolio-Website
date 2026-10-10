/* ==========================================================================
   Adnan Mansha — Portfolio
   AngularJS 1.x application.

   All page content lives in PortfolioController as data, and the template
   renders it with ng-repeat. Editing the site means editing an array here —
   the markup never repeats itself, and the detail popups read from the same
   objects as the cards that open them.

   Behaviour that touches the DOM is isolated in directives, one per concern.
   ========================================================================== */
(function () {
  'use strict';

  var app = angular.module('portfolio', []);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ======================================================================
     CONTENT
     ====================================================================== */
  app.constant('CONTENT', {
    profile: {
      name: 'Adnan Mansha',
      title: 'C#/.NET Software Developer',
      roles: [
        'C# / .NET Software Developer',
        'WPF / MVVM Application Developer',
        'Backend & REST API Engineer',
        'Industrial Machine-Control Software'
      ],
      summary: 'Software Developer with 4+ years of experience in C#/.NET, building ' +
        'WPF/MVVM applications and backend services for industrial machine-control ' +
        'software. Experienced in REST APIs, ASP.NET Core (MVC), Python/Flask, Vue.js, ' +
        'SQL databases, Docker, CI/CD and Test-Driven Development (TDD). Strong in clean ' +
        'architecture, design patterns and multithreading. Holds an M.Sc. in Automotive ' +
        'Software Engineering from TU Chemnitz, Germany.',
      email: 'adnanmansha64@gmail.com',
      phone: '+49 177 6925955',
      phoneHref: 'tel:+491776925955',
      location: 'Erfurt, Germany',
      linkedin: 'https://www.linkedin.com/in/adnan-mansha-278a46108/',
      xing: 'https://www.xing.com/profile/Adnan_Mansha/web_profiles',
      github: 'https://github.com/AdnanMansha64',
      repo: 'https://github.com/AdnanMansha64/Portfolio-Website'
    },

    stats: [
      { value: 4,  suffix: '+', label: 'Years experience' },
      { value: 6,  suffix: '',  label: 'Roles delivered' },
      { value: 97, suffix: '%', label: 'Verification accuracy' },
      { text: 'M.Sc.', label: 'Automotive SE' }
    ],

    about: [
      {
        icon: 'i-code',
        title: 'Industrial machine-control software',
        text: 'WPF/MVVM applications for production inspection machines, using Prism ' +
              'and the WPF Dispatcher so background work updates the UI safely and ' +
              'never freezes it.'
      },
      {
        icon: 'i-layers',
        title: 'Backend services & REST APIs',
        text: 'C# services and RESTful APIs — vehicle-listing synchronisation, ' +
              'barcode lifecycle tracking, ASP.NET Core (MVC) and Flask (MVC) web ' +
              'applications backed by SQL stores.'
      },
      {
        icon: 'i-branch',
        title: 'Concurrency & distributed communication',
        text: 'Client–server TCP/IP with publish–subscribe messaging, and the race ' +
              'conditions and deadlocks that come with it — resolved via async/await, ' +
              'SynchronizationContext, ConfigureAwait and TaskScheduler.'
      },
      {
        icon: 'i-beaker',
        title: 'Clean architecture & TDD',
        text: 'SOLID, dependency injection and Factory, Repository, Observer and ' +
              'Mediator patterns, backed by unit and integration tests and architecture ' +
              'documentation in IBM RTC and Gitea.'
      }
    ],

    proficiencies: [
      { name: 'C# / .NET',                level: 95 },
      { name: 'WPF / XAML (MVVM)',        level: 90 },
      { name: 'REST APIs',                level: 88 },
      { name: 'Async & multithreading',   level: 88 },
      { name: 'ASP.NET Core (MVC)',       level: 80 },
      { name: 'SQL & databases',          level: 80 },
      { name: 'Python / Flask',           level: 75 },
      { name: 'Docker & CI/CD',           level: 75 }
    ],

    skillGroups: [
      { icon: 'i-code',   title: 'Programming languages',
        tags: ['C#', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'Java (academic)', 'C++ (academic)'], lead: 1 },
      { icon: 'i-layers', title: 'Frameworks & libraries',
        tags: ['.NET', 'ASP.NET Core (MVC)', 'WPF/XAML (MVVM)', 'Flask', 'Vue.js', 'Node.js', 'MS Power Apps', 'pandas', 'OpenCV', 'Matplotlib'], lead: 1 },
      { icon: 'i-globe',  title: 'Web & APIs',
        tags: ['REST APIs', 'HTML5', 'CSS3', 'Bootstrap'], lead: 1 },
      { icon: 'i-database', title: 'Data & databases',
        tags: ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'MS Dataverse', 'MinIO'], lead: 0 },
      { icon: 'i-branch', title: 'Architecture & concepts',
        tags: ['OOP', 'SOLID', 'Dependency Injection (Unity Container)', 'Factory', 'Repository', 'Observer', 'Mediator', 'Async/Await', 'Multithreading', 'Reflection', 'XML/XSD Serialization'], lead: 1 },
      { icon: 'i-beaker', title: 'Testing & version control',
        tags: ['TDD', 'Unit & Integration Testing', 'Git', 'GitHub', 'GitLab', 'Gitea', 'Bitbucket'], lead: 1 },
      { icon: 'i-wrench', title: 'Systems & domains',
        tags: ['Industrial machine-control software', 'Client–Server & TCP/IP', 'Publish–Subscribe', 'Vision systems (AOI)'], lead: 1 },
      { icon: 'i-cloud',  title: 'DevOps & monitoring',
        tags: ['Docker', 'GitLab CI/CD', 'Linux', 'Jenkins', 'Elasticsearch', 'Kibana', 'Prometheus/Grafana (basic)'], lead: 0 },
      { icon: 'i-users',  title: 'Tools & collaboration',
        tags: ['Visual Studio', 'VS Code', 'Postman', 'Jira', 'Scrum', 'Kanban', 'Code Reviews'], lead: 0 },
      { icon: 'i-sparkle', title: 'AI-assisted development',
        tags: ['MS Copilot', 'Claude Code', 'Windsurf'], lead: 0 },
      { icon: 'i-chart',  title: 'Soft skills',
        tags: ['Problem Solving', 'Quick Learning', 'Team Collaboration', 'Stakeholder Communication'], lead: 0 }
    ],

    jobs: [
      {
        current: true,
        date: '11/2023 — 08/2026',
        title: 'Software Developer',
        org: 'Ferchau GmbH (deployed at Laser Imaging System GmbH — KLA Co.)',
        place: 'Jena, Germany',
        excerpt: 'Machine-control software for production inspection systems: moved ' +
                 'client–server communication to a distributed architecture, rebuilt a ' +
                 'legacy logging module around the Mediator pattern, and delivered ' +
                 'machine features from requirements through to production validation.',
        tags: ['C#', '.NET', 'WPF (MVVM)', 'Prism', 'Design Patterns', 'RTC', 'Gitea'],
        detailHeading: 'What I delivered',
        details: [
          { lead: 'Distributed TCP/IP communication:', text: 'moved the client–server communication from a localhost-only setup to a distributed network architecture with a configurable server IP, enabling remote access. Introduced a reusable NuGet-based communication component with a publish–subscribe pattern, and resolved race conditions and deadlocks using async/await, SynchronizationContext, ConfigureAwait and TaskScheduler.' },
          { lead: 'Production log refactoring:', text: 'analysed a complex legacy logging module through code review and debugging, then redesigned it with the Mediator pattern. Delivered a loosely coupled, optimised implementation that removed blocking and concurrency issues, after prototyping and aligning the solution with the team.' },
          { lead: 'Machine features from requirements to production:', text: 'delivered an asynchronous firmware version checker and a configurable range-slider for module settings. This covered stakeholder requirements, solution presentations, prototyping and implementation, using the WPF Dispatcher for safe UI updates from background threads. Both features were validated on production machines.' },
          { lead: 'R&D feature toggle:', text: 'extended the feature-toggle framework to separate R&D functionality from production-ready features, so experimental features could be developed and tested without affecting production machines.' },
          { lead: 'Code quality and performance:', text: 'optimised .NET components for responsiveness and thread safety, applying SOLID principles, dependency injection and Factory, Repository, Observer and Mediator patterns. Backed by TDD with unit and integration tests and technical architecture documentation (IBM RTC, Gitea).' }
        ],
        stack: ['C#', '.NET', 'WPF', 'MVVM', 'Prism', 'TCP/IP', 'async/await', 'TDD', 'IBM RTC', 'Gitea']
      },
      {
        date: '03/2023 — 09/2023',
        title: 'Software Developer',
        org: 'Modulacht GmbH',
        place: 'Truchtlaching, Germany',
        excerpt: 'C# services and REST APIs around Microsoft Dataverse — vehicle-listing ' +
                 'synchronisation with mobile.de and AutoScout24, barcode lifecycle ' +
                 'tracking, and a WPF tool that generates C# enums from the data model.',
        tags: ['C#', '.NET', 'WPF (MVVM)', 'MS Power Apps', 'Dataverse', 'REST APIs'],
        detailHeading: 'What I delivered',
        details: [
          { lead: 'Vehicle listing synchronisation:', text: "developed a C# service that automatically synced a client's vehicle ads with mobile.de and AutoScout24 via REST APIs, using data from Microsoft Dataverse." },
          { lead: 'Multiloop box-tracking system:', text: 'built custom REST APIs to track reusable boxes by barcode/GUID through their recycling lifecycle, used by the frontend team in Power Apps.' },
          { lead: 'Dataverse Enum Generator:', text: 'created a WPF (MVVM) tool that connects to Dataverse and directly generates reusable C# enum classes (.cs files) from the selected entity definitions, keeping the code in sync with the data model.' }
        ],
        stack: ['C#', '.NET', 'WPF', 'MVVM', 'MS Dataverse', 'MS Power Apps', 'REST APIs']
      },
      {
        date: '10/2022 — 02/2023',
        title: 'Full-Stack Developer',
        titleNote: '(Working Student)',
        org: 'Exxeta AG',
        place: 'Stuttgart, Germany',
        excerpt: 'Contributed to "Quiz Me", a quiz application with a Vue.js frontend and ' +
                 'a Node.js backend using socket-based client–server communication, with ' +
                 'Elasticsearch/Kibana logging on Docker and GitLab CI/CD.',
        tags: ['Node.js', 'Vue.js', 'TypeScript', 'Elasticsearch', 'Docker'],
        detailHeading: 'What I delivered',
        details: [
          { lead: '"Quiz Me" web application:', text: 'contributed to the development of a quiz application with a Vue.js frontend and a Node.js backend, including socket-based client–server communication.' },
          { lead: 'Logging and monitoring:', text: 'used Elasticsearch and Kibana for application logging, and gained working knowledge of Prometheus and Grafana for application monitoring.' },
          { lead: 'Docker and CI/CD:', text: "worked with Docker-based environments and contributed to maintaining the application's GitLab CI/CD pipeline." }
        ],
        stack: ['Vue.js', 'Node.js', 'TypeScript', 'Elasticsearch', 'Kibana', 'Docker', 'GitLab CI/CD']
      },
      {
        date: '11/2021 — 07/2022',
        title: "Master's Thesis",
        org: 'Robert Bosch GmbH',
        place: 'Reutlingen, Germany',
        excerpt: 'Python ETL pipelines moving inspection images from Halcon and Keyence ' +
                 'machines into a MinIO (S3) object store — cutting the daily transfer ' +
                 'from a full day to 3–4 hours — plus a Flask (MVC) web app for defect analysis.',
        tags: ['Python', 'Flask (MVC)', 'MinIO', 'RESTful APIs', 'SQLite'],
        detailHeading: 'What I delivered',
        details: [
          { lead: 'Automated data pipelines:', text: 'built Python ETL pipelines moving inspection images from Halcon and Keyence machines into a MinIO (S3) object store, cutting the daily data transfer from a full day to 3–4 hours.' },
          { lead: 'Reliable data lifecycle:', text: 'tracked upload, validation and deletion per machine in SQLite, so files are removed from machines only after they are confirmed in storage.' },
          { lead: 'REST APIs and web interface:', text: 'developed a Flask (MVC) web app with REST APIs to filter, visualise and annotate inspection images for defect analysis.' }
        ],
        stack: ['Python', 'Flask', 'MVC', 'MinIO (S3)', 'SQLite', 'REST APIs', 'ETL']
      },
      {
        date: '03/2021 — 08/2021',
        title: 'Software Developer',
        titleNote: '(Mandatory Internship)',
        org: 'Robert Bosch GmbH',
        place: 'Stuttgart, Germany',
        excerpt: 'Replaced a slow WinForms validation tool with a C#/WPF (MVVM) ' +
                 'application using async processing, built on a reflection-based ' +
                 'validation engine where new rules plug in without code changes.',
        tags: ['C#', '.NET', 'WPF (MVVM)', 'Reflection', 'Unit testing'],
        detailHeading: 'What I delivered',
        details: [
          { lead: 'Legacy tool replacement:', text: 'built a C#/WPF (MVVM) validation tool replacing a slow WinForms tool, using async processing to remove GUI freezes.' },
          { lead: 'Extensible validation engine:', text: 'designed a reflection-based engine for XML repository data (GUID, naming, path and version checks) where new rules plug in without code changes, covered by unit tests.' },
          { lead: 'User interface and release workflow:', text: 'built a navigation tree, persistent favourites and results grid, plus a one-click release that emails the validated object via Outlook.' }
        ],
        stack: ['C#', '.NET', 'WPF', 'MVVM', 'Reflection', 'XML', 'Unit testing']
      },
      {
        date: '10/2018 — 12/2020',
        title: 'Data Worker',
        titleNote: '(Working Student)',
        org: 'Solactive Technologies GmbH',
        place: 'Dresden, Germany',
        excerpt: 'Annotated and classified financial documents and securities ' +
                 'prospectuses to build the target database for data-mining applications ' +
                 'processing financial market data.',
        tags: ['WebAnno', 'Data QA', 'Classification'],
        detailHeading: 'What I delivered',
        details: [
          { lead: 'Document annotation:', text: 'annotated financial documents to build the target database for data-mining applications that process financial market data.' },
          { lead: 'Prospectus classification:', text: 'classified securities prospectuses used for index products such as ETFs.' },
          { lead: 'Data quality management:', text: 'performed quality management of the data in the database to keep it accurate and consistent for downstream data-science workflows.' }
        ],
        stack: ['WebAnno', 'Data annotation', 'Data QA']
      }
    ],

    projects: [
      {
        icon: 'i-branch',
        title: 'Distributed TCP/IP communication',
        context: 'KLA Co. · production system, 2023–2026',
        desc: 'Moved client–server communication from localhost-only to a distributed ' +
              'network architecture with a configurable server IP, enabling remote access.',
        tags: ['C#', 'TCP/IP', 'Publish–Subscribe', 'async/await'],
        sections: [
          { heading: 'What I did', items: [
            { text: 'Re-architected the transport so the server IP is configurable, turning a localhost-only deployment into a genuinely distributed one.' },
            { lead: 'Reusable component:', text: 'introduced a NuGet-based communication component with a publish–subscribe pattern, so every consumer shared one tested implementation.' },
            { lead: 'Concurrency defects:', text: 'resolved race conditions and deadlocks using async/await, SynchronizationContext, ConfigureAwait and TaskScheduler.' }
          ]}
        ],
        stack: ['C#', '.NET', 'TCP/IP', 'NuGet', 'Publish–Subscribe', 'async/await']
      },
      {
        icon: 'i-layers',
        title: 'Production log refactoring',
        context: 'KLA Co. · internal tooling, 2023–2026',
        desc: 'Redesigned a complex legacy logging module with the Mediator pattern, ' +
              'removing blocking and concurrency issues from a tightly coupled design.',
        tags: ['C#', 'Mediator', 'Refactoring', 'Concurrency'],
        sections: [
          { heading: 'What I did', items: [
            { text: 'Analysed the legacy module through code review and debugging before changing anything.' },
            { text: 'Redesigned it with the Mediator pattern, delivering a loosely coupled, optimised implementation.' },
            { text: 'Removed the blocking and concurrency issues, after prototyping and aligning the solution with the team.' }
          ]}
        ],
        stack: ['C#', '.NET', 'Mediator pattern', 'Refactoring']
      },
      {
        icon: 'i-check',
        title: 'Machine features: firmware checker & range slider',
        context: 'KLA Co. · production features, 2023–2026',
        desc: 'An asynchronous firmware version checker and a configurable range-slider ' +
              'for module settings, taken from stakeholder requirements through to ' +
              'validation on production machines.',
        tags: ['C#', 'WPF Dispatcher', 'async/await', 'Testing'],
        sections: [
          { heading: 'What I did', items: [
            { text: 'Covered stakeholder requirements, solution presentations, prototyping and implementation.' },
            { lead: 'UI threading:', text: 'used the WPF Dispatcher for safe UI updates from background threads.' },
            { text: 'Both features were validated on production machines.' }
          ]}
        ],
        stack: ['C#', '.NET', 'WPF', 'Dispatcher', 'async/await']
      },
      {
        icon: 'i-cloud',
        title: 'Vehicle listing synchronisation',
        context: 'Modulacht GmbH · 2023',
        desc: "C# service that automatically synced a client's vehicle ads with mobile.de " +
              'and AutoScout24 via REST APIs, driven by data from Microsoft Dataverse.',
        tags: ['C#', 'REST APIs', 'MS Dataverse', 'Integration'],
        sections: [
          { heading: 'What I built', items: [
            { text: "A C# service that automatically synced a client's vehicle advertisements with mobile.de and AutoScout24 over their REST APIs." },
            { text: 'Microsoft Dataverse supplied the source data, so the listings stayed consistent with the business system.' }
          ]}
        ],
        stack: ['C#', '.NET', 'REST APIs', 'MS Dataverse']
      },
      {
        icon: 'i-wrench',
        title: 'Dataverse Enum Generator',
        context: 'Modulacht GmbH · 2023',
        desc: 'WPF (MVVM) tool that connects to Dataverse and generates reusable C# enum ' +
              'classes directly from selected entity definitions, keeping code in sync ' +
              'with the data model.',
        tags: ['C#', 'WPF (MVVM)', 'Dataverse', 'Code generation'],
        sections: [
          { heading: 'What I built', items: [
            { text: 'A WPF (MVVM) tool that connects to Dataverse and lists the available entity definitions.' },
            { text: 'It generates reusable C# enum classes (.cs files) directly from the selected entities, so the code cannot drift from the data model.' }
          ]}
        ],
        stack: ['C#', '.NET', 'WPF', 'MVVM', 'MS Dataverse']
      },
      {
        icon: 'i-database',
        title: 'Automated image ETL into MinIO',
        context: "Robert Bosch · Master's thesis, 2021–2022",
        desc: 'Python ETL pipelines moving inspection images from Halcon and Keyence ' +
              'machines into a MinIO (S3) object store — daily transfer cut from a full ' +
              'day to 3–4 hours.',
        tags: ['Python', 'ETL', 'MinIO (S3)', 'SQLite'],
        sections: [
          { heading: 'What I built', items: [
            { lead: 'Automated data pipelines:', text: 'Python ETL moving inspection images from Halcon and Keyence machines into a MinIO (S3) object store, cutting the daily data transfer from a full day to 3–4 hours.' },
            { lead: 'Reliable data lifecycle:', text: 'upload, validation and deletion tracked per machine in SQLite, so files are removed from a machine only once confirmed in storage.' },
            { lead: 'Web interface:', text: 'a Flask (MVC) app with REST APIs to filter, visualise and annotate inspection images for defect analysis.' }
          ]}
        ],
        stack: ['Python', 'Flask', 'MinIO (S3)', 'SQLite', 'REST APIs']
      },
      {
        icon: 'i-beaker',
        title: 'Reflection-based XML validation tool',
        context: 'Robert Bosch · internship, 2021',
        desc: 'C#/WPF (MVVM) tool replacing a slow WinForms predecessor, built on a ' +
              'reflection-based engine where new validation rules plug in without code changes.',
        tags: ['C#', 'WPF (MVVM)', 'Reflection', 'Unit testing'],
        sections: [
          { heading: 'What I built', items: [
            { lead: 'Legacy replacement:', text: 'a C#/WPF (MVVM) validation tool replacing a slow WinForms tool, using async processing to remove GUI freezes.' },
            { lead: 'Extensible engine:', text: 'a reflection-based engine for XML repository data (GUID, naming, path and version checks) where new rules plug in without code changes, covered by unit tests.' },
            { lead: 'Release workflow:', text: 'a navigation tree, persistent favourites and results grid, plus a one-click release that emails the validated object via Outlook.' }
          ]}
        ],
        stack: ['C#', '.NET', 'WPF', 'MVVM', 'Reflection', 'XML', 'Unit testing']
      },
      {
        icon: 'i-globe',
        title: 'Proxy Provider Application',
        context: 'TU Chemnitz · academic project, 2019',
        desc: 'Collected live data from multiple proxy providers via RSS feeds and APIs ' +
              'into a SQL database, exposed to the frontend through a REST API.',
        tags: ['C#', 'ASP.NET Core (MVC)', 'REST API', 'SQL'],
        sections: [
          { heading: 'What I built', items: [
            { text: 'Collected live data from multiple proxy providers via RSS feeds and APIs into a SQL database.' },
            { text: 'Developed a REST API to provide the stored data in a structured format for the frontend.' }
          ]}
        ],
        stack: ['C#', 'ASP.NET Core (MVC)', 'REST API', 'SQL', 'HTML5', 'CSS3', 'JavaScript']
      },
      {
        icon: 'i-award',
        title: 'Fingerprint & signature verification system',
        context: 'IIU Islamabad · academic project, 2015',
        desc: 'C# desktop application verifying fingerprints and signatures through image ' +
              "processing, reaching 97% accuracy — about 25% above the university's " +
              'existing system.',
        tags: ['C#', 'WinForms', 'Image processing', 'MySQL'],
        sections: [
          { heading: 'What I built', items: [
            { text: 'A C# desktop application for fingerprint and signature verification using image processing.' },
            { text: "Achieved 97% verification accuracy, about 25% higher than the university's existing system." }
          ]}
        ],
        stack: ['C#', '.NET', 'WinForms', 'Image processing', 'MySQL']
      }
    ],

    education: [
      { date: '2018 — 2023', degree: 'M.Sc. Automotive Software Engineering',
        school: 'Technische Universität Chemnitz', place: 'Germany' },
      { date: '2011 — 2015', degree: 'B.Sc. Software Engineering',
        school: 'International Islamic University', place: 'Islamabad, Pakistan' }
    ],

    // `status` marks a certification that is not yet earned, so the page never
    // implies a credential that has not been awarded.
    certifications: [
      { name: 'Microsoft Azure Administrator (AZ-104)', source: 'Microsoft', status: 'In Progress' },
      { name: 'C# Essential Training 1: Types and Control Flow', source: 'LinkedIn · 2024' },
      { name: 'Advanced C#: Hands-on with LINQ, Dynamic Types, Extension Methods, and Tuples', source: 'LinkedIn · 2024' },
      { name: 'Microsoft Azure DevOps Engineer Expert (AZ-400)', source: 'Microsoft', status: 'Planned' },
      { name: 'Microsoft Azure AI Cloud Developer Associate (AI-200)', source: 'Microsoft', status: 'Planned' }
    ],

    languages: [
      { name: 'English', level: 'C1' },
      { name: 'German',  level: 'B1' }
    ]
  });

  /* ======================================================================
     THEME — dark by default, persisted, follows the OS until chosen
     ====================================================================== */
  app.factory('theme', ['$window', function ($window) {
    var KEY = 'am-theme';
    var root = document.documentElement;

    function read() {
      try { return $window.localStorage.getItem(KEY); } catch (e) { return null; }
    }
    function write(v) {
      try { $window.localStorage.setItem(KEY, v); } catch (e) { /* private mode */ }
    }

    var current = read();
    if (current !== 'light' && current !== 'dark') {
      current = $window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    root.setAttribute('data-theme', current);

    return {
      get: function () { return current; },
      toggle: function () {
        current = current === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', current);
        write(current);
        return current;
      }
    };
  }]);

  /* ======================================================================
     MAIN CONTROLLER
     ====================================================================== */
  app.controller('PortfolioController', ['$scope', '$window', '$timeout', 'CONTENT', 'theme',
  function ($scope, $window, $timeout, CONTENT, theme) {
    var vm = this;

    // ---- content ----
    vm.profile        = CONTENT.profile;
    vm.stats          = CONTENT.stats;
    vm.about          = CONTENT.about;
    vm.proficiencies  = CONTENT.proficiencies;
    vm.skillGroups    = CONTENT.skillGroups;
    vm.jobs           = CONTENT.jobs;
    vm.projects       = CONTENT.projects;
    vm.education      = CONTENT.education;
    vm.certifications = CONTENT.certifications;
    vm.languages      = CONTENT.languages;
    vm.year           = new Date().getFullYear();

    vm.sections = [
      { id: 'about',      label: 'About' },
      { id: 'skills',     label: 'Skills' },
      { id: 'experience', label: 'Experience' },
      { id: 'projects',   label: 'Projects' },
      { id: 'education',  label: 'Education' },
      { id: 'contact',    label: 'Contact' }
    ];

    // ---- theme ----
    vm.theme = theme.get();
    vm.toggleTheme = function () { vm.theme = theme.toggle(); };

    // ---- mobile nav ----
    vm.navOpen = false;
    vm.toggleNav = function () { vm.navOpen = !vm.navOpen; };
    vm.closeNav  = function () { vm.navOpen = false; };

    // ---- scroll spy (set by the amScrollSpy directive) ----
    vm.activeSection = '';

    // ---- detail popup: reads the same object the card was built from ----
    vm.modal = null;
    vm.openModal = function (item, eyebrow) {
      vm.modal = {
        title: item.title,
        eyebrow: eyebrow,
        sections: item.sections ||
          [{ heading: item.detailHeading || 'Details', items: item.details || [] }],
        stack: item.stack || []
      };
      document.body.classList.add('is-locked');
    };
    vm.closeModal = function () {
      vm.modal = null;
      document.body.classList.remove('is-locked');
    };

    vm.jobEyebrow = function (job) { return job.date + ' · ' + job.place; };

    // ---- projects slider ----
    vm.slide = 0;
    vm.perView = 1;

    function measure() {
      var w = $window.innerWidth;
      vm.perView = w >= 1000 ? 3 : w >= 680 ? 2 : 1;
      vm.maxSlide = Math.max(0, vm.projects.length - vm.perView);
      if (vm.slide > vm.maxSlide) { vm.slide = vm.maxSlide; }
    }
    measure();

    vm.slideBasis = function () { return (100 / vm.perView) + '%'; };
    vm.trackShift = function () {
      return { transform: 'translateX(' + (-vm.slide * (100 / vm.perView)) + '%)' };
    };
    vm.go      = function (i) { vm.slide = Math.max(0, Math.min(i, vm.maxSlide)); };
    vm.next    = function () { vm.go(vm.slide + 1); };
    vm.prev    = function () { vm.go(vm.slide - 1); };
    vm.dots    = function () {
      var out = [];
      for (var i = 0; i <= vm.maxSlide; i++) { out.push(i); }
      return out;
    };
    // Keeps off-screen cards out of the tab order.
    vm.slideVisible = function (i) { return i >= vm.slide && i < vm.slide + vm.perView; };

    var resizeTimer;
    angular.element($window).on('resize', function () {
      $timeout.cancel(resizeTimer);
      resizeTimer = $timeout(measure, 120);
    });

    // ---- copy to clipboard ----
    vm.toast = null;
    vm.copy = function (value, $event) {
      if ($event) { $event.preventDefault(); $event.stopPropagation(); }
      function flash(msg) {
        vm.toast = msg;
        $timeout(function () { vm.toast = null; }, 2000);
      }
      if ($window.navigator.clipboard && $window.navigator.clipboard.writeText) {
        $window.navigator.clipboard.writeText(value).then(
          function () { $scope.$apply(function () { flash('Copied: ' + value); }); },
          function () { $scope.$apply(function () { flash('Press Ctrl+C to copy'); }); }
        );
      } else {
        flash(value);
      }
    };

    // ---- back to top ----
    vm.showToTop = false;
    vm.toTop = function () {
      $window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    var ticking = false;
    angular.element($window).on('scroll', function () {
      if (ticking) { return; }
      ticking = true;
      $window.requestAnimationFrame(function () {
        var show = $window.pageYOffset > 600;
        if (show !== vm.showToTop) { $scope.$apply(function () { vm.showToTop = show; }); }
        ticking = false;
      });
    });

    // ---- Esc closes the popup and the mobile nav ----
    angular.element(document).on('keydown', function (e) {
      if (e.key !== 'Escape') { return; }
      if (vm.modal || vm.navOpen) {
        $scope.$apply(function () { vm.closeModal(); vm.closeNav(); });
      }
    });
  }]);

  /* ======================================================================
     DIRECTIVES — one per DOM concern
     ====================================================================== */

  // Reveal on scroll.
  app.directive('amReveal', ['$timeout', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var el = element[0];
        el.classList.add('reveal');

        if (reduceMotion || !('IntersectionObserver' in window)) {
          el.classList.add('is-visible');
          return;
        }

        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) { return; }
            $timeout(function () { el.classList.add('is-visible'); },
                     parseInt(attrs.amReveal, 10) || 0);
            observer.unobserve(el);
          });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

        observer.observe(el);
        scope.$on('$destroy', function () { observer.disconnect(); });
      }
    };
  }]);

  // Typewriter for the hero role line.
  app.directive('amTyping', ['$interval', function ($interval) {
    return {
      restrict: 'A',
      scope: { phrases: '=amTyping' },
      link: function (scope, element) {
        var phrases = scope.phrases || [];
        if (!phrases.length) { return; }

        if (reduceMotion) { element.text(phrases[0]); return; }

        var out = angular.element('<span></span>');
        var caret = angular.element('<span class="caret" aria-hidden="true"></span>');
        element.empty().append(out).append(caret);

        var pi = 0, ci = 0, deleting = false, timer;

        function tick() {
          var phrase = phrases[pi];
          ci += deleting ? -1 : 1;
          out.text(phrase.slice(0, ci));

          var wait = deleting ? 35 : 65;
          if (!deleting && ci === phrase.length) { deleting = true; wait = 1900; }
          else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; wait = 350; }

          timer = $interval(tick, wait, 1);
        }
        tick();
        scope.$on('$destroy', function () { $interval.cancel(timer); });
      }
    };
  }]);

  // Count-up for the stat tiles.
  app.directive('amCount', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var target = parseFloat(attrs.amCount);
        var suffix = attrs.amCountSuffix || '';
        var el = element[0];

        function run() {
          if (reduceMotion) { el.textContent = target + suffix; return; }
          var start = performance.now();
          (function frame(now) {
            var p = Math.min((now - start) / 1200, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
            if (p < 1) { requestAnimationFrame(frame); }
          })(start);
        }

        if (!('IntersectionObserver' in window)) { run(); return; }
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) { return; }
            run();
            observer.unobserve(el);
          });
        }, { threshold: 0.5 });
        observer.observe(el);
        scope.$on('$destroy', function () { observer.disconnect(); });
      }
    };
  });

  // Animates a proficiency bar to its level once visible.
  app.directive('amBar', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var el = element[0];
        var level = attrs.amBar + '%';

        if (reduceMotion || !('IntersectionObserver' in window)) {
          el.style.width = level;
          return;
        }
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) { return; }
            el.style.width = level;
            observer.unobserve(el);
          });
        }, { threshold: 0.4 });
        observer.observe(el);
        scope.$on('$destroy', function () { observer.disconnect(); });
      }
    };
  });

  // Highlights the nav link for the section in view.
  app.directive('amScrollSpy', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        if (!('IntersectionObserver' in window)) { return; }

        var sections = [].slice.call(document.querySelectorAll('section[id]'));
        if (!sections.length) { return; }

        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) { return; }
            scope.$apply(function () {
              scope.$eval(attrs.amScrollSpy + " = '" + entry.target.id + "'");
            });
          });
        }, { rootMargin: '-45% 0px -50% 0px' });

        sections.forEach(function (s) { observer.observe(s); });
        scope.$on('$destroy', function () { observer.disconnect(); });
      }
    };
  });

  // Touch swipe for the slider.
  app.directive('amSwipe', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var startX = null;

        element.on('touchstart', function (e) { startX = e.touches[0].clientX; });
        element.on('touchend', function (e) {
          if (startX === null) { return; }
          var dx = e.changedTouches[0].clientX - startX;
          startX = null;
          if (Math.abs(dx) < 45) { return; }
          scope.$apply(function () {
            scope.$eval(dx < 0 ? attrs.amSwipeNext : attrs.amSwipePrev);
          });
        });

        element.on('keydown', function (e) {
          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') { return; }
          scope.$apply(function () {
            scope.$eval(e.key === 'ArrowRight' ? attrs.amSwipeNext : attrs.amSwipePrev);
          });
        });
      }
    };
  });

  // Traps focus inside the popup while it is open, and restores it on close.
  app.directive('amFocusTrap', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var previous = document.activeElement;
        var dialog = element[0];

        dialog.focus();

        function onKey(e) {
          if (e.key !== 'Tab') { return; }
          var focusable = [].slice.call(dialog.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )).filter(function (el) { return el.offsetParent !== null; });
          if (!focusable.length) { return; }

          var first = focusable[0], last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }

        document.addEventListener('keydown', onKey);
        scope.$on('$destroy', function () {
          document.removeEventListener('keydown', onKey);
          if (previous && previous.focus) { previous.focus(); }
        });
      }
    };
  });
})();
