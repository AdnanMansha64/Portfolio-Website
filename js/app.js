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
      roles: [
        'Software Developer — C# / .NET',
        'Backend & API Engineer',
        'WPF / MVVM Specialist',
        'ASP.NET Core MVC Developer'
      ],
      summary: 'Results-oriented developer with 4+ years building scalable backend ' +
        'services and cross-platform applications in C#, .NET and ASP.NET Core. Deep ' +
        'experience in RESTful APIs, WPF/MVVM desktop systems, and the concurrency and ' +
        'TCP/IP architecture behind hardware-interfacing production software. ' +
        'M.Sc. in Automotive Software Engineering.',
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
      { value: 50, suffix: '+', label: 'Tests written' },
      { value: 6,  suffix: '',  label: 'Roles delivered' },
      { text: 'M.Sc.', label: 'Automotive SE' }
    ],

    about: [
      {
        icon: 'i-layers',
        title: 'Backend & APIs',
        text: 'ASP.NET Core MVC services and RESTful APIs designed around SOLID and ' +
              'dependency injection, with clean separation between transport, domain ' +
              'and persistence.'
      },
      {
        icon: 'i-code',
        title: 'Desktop (WPF / MVVM)',
        text: 'Production WPF applications using MVVM and Prism, including UI-thread ' +
              'marshalling via Dispatcher so background work never blocks or corrupts ' +
              'the interface.'
      },
      {
        icon: 'i-branch',
        title: 'Concurrency & networking',
        text: 'Async/await, TCP/IP client–server layers and Publisher/Subscriber ' +
              'messaging — including hunting down the race conditions and deadlocks ' +
              'that come with them.'
      },
      {
        icon: 'i-beaker',
        title: 'Testing & quality',
        text: 'TDD by default: 50+ unit and integration tests on recent feature work, ' +
              'validated on production machines, with architecture documented for the ' +
              'next developer.'
      }
    ],

    proficiencies: [
      { name: 'C# / .NET',               level: 95 },
      { name: 'WPF / MVVM',              level: 90 },
      { name: 'ASP.NET Core MVC',        level: 85 },
      { name: 'REST APIs & async',       level: 88 },
      { name: 'SQL & databases',         level: 80 },
      { name: 'Docker & CI/CD',          level: 78 },
      { name: 'Python / Flask',          level: 75 },
      { name: 'TypeScript / JavaScript', level: 70 }
    ],

    skillGroups: [
      { icon: 'i-code',     title: 'Programming',
        tags: ['C#', 'LINQ', 'async/await', 'Generics', 'Python', 'TypeScript', 'JavaScript'], lead: 1 },
      { icon: 'i-layers',   title: 'Frameworks',
        tags: ['.NET', 'ASP.NET Core MVC', 'WPF (MVVM)', 'Prism', 'REST APIs', 'Flask', 'Vue.js', 'Node.js', 'MS Power Apps'], lead: 1 },
      { icon: 'i-branch',   title: 'Design & architecture',
        tags: ['SOLID', 'Dependency Injection', 'Unity Container', 'Factory', 'Repository', 'Observer', 'Mediator', 'Singleton', 'Client–Server', 'Pub/Sub', 'TCP/IP'], lead: 1 },
      { icon: 'i-database', title: 'Databases',
        tags: ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'MS Dataverse', 'MinIO'], lead: 0 },
      { icon: 'i-cloud',    title: 'Cloud & DevOps',
        tags: ['AWS S3', 'Docker', 'CI/CD', 'Jenkins', 'GitLab CI', 'Linux'], lead: 0 },
      { icon: 'i-beaker',   title: 'Testing',
        tags: ['TDD', 'Unit testing', 'Integration testing', 'Production validation'], lead: 1 },
      { icon: 'i-chart',    title: 'Monitoring',
        tags: ['Elasticsearch', 'Kibana', 'Prometheus', 'Grafana'], lead: 0 },
      { icon: 'i-globe',    title: 'Web technologies',
        tags: ['HTML5', 'CSS3', 'XAML', 'Bootstrap', 'AngularJS'], lead: 0 },
      { icon: 'i-branch',   title: 'Version control',
        tags: ['Git', 'GitHub', 'GitLab', 'Gitea', 'Bitbucket'], lead: 0 },
      { icon: 'i-users',    title: 'Collaboration',
        tags: ['Scrum', 'Jira', 'Code reviews', 'Cross-functional teams', 'RTC'], lead: 0 },
      { icon: 'i-wrench',   title: 'Dev tools',
        tags: ['Visual Studio', 'VS Code', 'Postman', 'Rider'], lead: 0 },
      { icon: 'i-sparkle',  title: 'AI tools',
        tags: ['Claude', 'ChatGPT', 'MS Copilot', 'Windsurf IDE'], lead: 0 }
    ],

    jobs: [
      {
        current: true,
        date: '11/2023 — 08/2026',
        title: 'Software Developer',
        org: 'Ferchau GmbH — deployed at Laser Imaging System GmbH (KLA Co.)',
        place: 'Jena, Germany',
        excerpt: 'Owned seven features end to end on a production wafer-inspection ' +
                 'platform — remote access architecture, TCP/IP refactoring, async ' +
                 'firmware checks and a Mediator-based logging rewrite — all under TDD ' +
                 'with 50+ tests.',
        tags: ['C#', '.NET', 'WPF/MVVM', 'Prism', 'TCP/IP', 'async/await'],
        detailHeading: 'What I delivered',
        details: [
          { lead: 'Remote access handling:', text: 'evolved client–server communication from a localhost-only TCP/IP setup to a distributed architecture with a configurable server IP, using async/await and non-blocking operations to keep the UI responsive during remote communication.' },
          { lead: 'Production log refactoring:', text: 'redesigned an under-optimised legacy logging module around the Mediator pattern to reduce coupling and complexity, resolving blocking and concurrency issues in the process.' },
          { lead: 'Firmware version checker:', text: 'implemented an asynchronous firmware version-check feature end to end — requirements, async/await implementation, unit and integration tests, and validation on production machines.' },
          { lead: 'Range slider configuration:', text: 'delivered a configurable range-slider feature using the WPF Dispatcher and UI-threading to safely marshal background-thread updates onto the UI, covered by unit and integration tests.' },
          { lead: 'R&D feature toggle:', text: 'extended the feature-toggle framework to isolate experimental functionality from production-ready features.' },
          { lead: 'TCP/IP communication refactoring:', text: 'introduced a reusable NuGet-based communication object and a Publisher/Subscriber pattern, resolving race conditions and deadlocks via SynchronizationContext, ConfigureAwait and the Task Scheduler.' },
          { lead: '.NET performance & concurrency:', text: 'applied SOLID, dependency injection and design patterns (Factory, Repository, Observer, Mediator), backed by TDD and 50+ unit and integration tests, with architecture documented in RTC and Gitea.' }
        ],
        stack: ['C#', '.NET', 'WPF', 'MVVM', 'Prism', 'Unity Container', 'TCP/IP', 'async/await', 'TDD', 'Gitea', 'RTC']
      },
      {
        date: '03/2023 — 09/2023',
        title: 'Software Developer',
        org: 'Modulacht GmbH',
        place: 'Truchtlaching, Germany',
        excerpt: 'Built C#/.NET WPF applications on MVVM plus a Power Apps/Dataverse ' +
                 'solution, joined by custom REST APIs for secure data exchange with ' +
                 'business systems.',
        tags: ['C#', '.NET', 'WPF/MVVM', 'Power Apps', 'Dataverse'],
        detailHeading: 'What I delivered',
        details: [
          { text: 'Developed C#/.NET WPF applications using MVVM for maintainable, structured UI solutions.' },
          { text: 'Built a Power Apps/Dataverse solution to automate business processes and data management.' },
          { text: 'Designed custom RESTful APIs for secure data exchange between Power Apps, Dataverse and business systems.' }
        ],
        stack: ['C#', '.NET', 'WPF', 'MVVM', 'MS Power Apps', 'Dataverse', 'REST APIs']
      },
      {
        date: '10/2022 — 02/2023',
        title: 'Full-Stack Developer',
        titleNote: '(Working Student)',
        org: 'Exxeta AG',
        place: 'Stuttgart, Germany',
        excerpt: 'Delivered a Vue.js/Node.js web application with full observability — ' +
                 'Elasticsearch, Kibana, Prometheus and Grafana — on Docker environments ' +
                 'and GitLab CI/CD.',
        tags: ['Vue.js', 'Node.js', 'Docker', 'GitLab CI/CD', 'Grafana'],
        detailHeading: 'What I delivered',
        details: [
          { text: 'Built a Vue.js/Node.js web application with logging and monitoring via Elasticsearch, Kibana, Prometheus and Grafana.' },
          { text: 'Managed Docker-based environments and GitLab CI/CD pipelines for automated builds, testing and deployments.' }
        ],
        stack: ['Vue.js', 'Node.js', 'Docker', 'GitLab CI/CD', 'Elasticsearch', 'Kibana', 'Prometheus', 'Grafana']
      },
      {
        date: '11/2021 — 07/2022',
        title: "Master's Thesis",
        org: 'Robert Bosch GmbH',
        place: 'Reutlingen, Germany',
        excerpt: 'Built data-processing pipelines and MVC user interfaces for vision ' +
                 'systems, including a client–server architecture, REST APIs and ' +
                 'Docker-based CI/CD automation.',
        tags: ['Python', 'Flask', 'MVC', 'Docker', 'REST'],
        detailHeading: 'What I delivered',
        details: [
          { text: 'Built data-processing pipelines and MVC-based user interfaces for vision systems, including a client–server architecture and RESTful APIs.' },
          { text: 'Automated build, testing and deployment with Docker, CI/CD and Git across backend and test environments.' }
        ],
        stack: ['Python', 'Flask', 'MVC', 'REST APIs', 'Docker', 'CI/CD', 'Git']
      },
      {
        date: '03/2021 — 08/2021',
        title: 'Software Developer',
        titleNote: '(Internship)',
        org: 'Robert Bosch GmbH',
        place: 'Stuttgart, Germany',
        excerpt: 'Built a C#/WPF validation tool on MVVM with unit tests for data ' +
                 'consistency, and automated the release process that followed ' +
                 'successful validation.',
        tags: ['C#', 'WPF/MVVM', 'Unit testing', 'Automation'],
        detailHeading: 'What I delivered',
        details: [
          { text: 'Built a C#/WPF validation tool using MVVM, with unit tests to ensure data consistency and quality.' },
          { text: 'Automated release processes following successful validation to reduce manual intervention.' }
        ],
        stack: ['C#', 'WPF', 'MVVM', 'Unit testing', 'Release automation']
      },
      {
        date: '10/2018 — 12/2020',
        title: 'Data Worker',
        titleNote: '(Working Student)',
        org: 'Solactive Technologies',
        place: 'Dresden, Germany',
        excerpt: 'Prepared, classified and quality-assured product and target data ' +
                 'supporting data science workflows and model development, using the ' +
                 'WebAnno annotation tool.',
        tags: ['WebAnno', 'Data QA', 'Classification'],
        detailHeading: 'What I delivered',
        details: [
          { text: 'Prepared, classified and quality-assured product and target data to support data science workflows and model development, using the WebAnno annotation tool.' }
        ],
        stack: ['WebAnno', 'Data QA', 'Data classification']
      }
    ],

    projects: [
      {
        icon: 'i-branch',
        title: 'TCP/IP communication layer refactor',
        context: 'KLA Co. · production system',
        desc: 'Rebuilt a client–server TCP/IP layer around a reusable NuGet package ' +
              'and Publisher/Subscriber messaging, resolving race conditions and deadlocks.',
        tags: ['C#', 'TCP/IP', 'Pub/Sub', 'Concurrency'],
        sections: [
          { heading: 'The problem', items: [
            { text: 'The existing client–server TCP/IP layer suffered from race conditions and deadlocks, and its communication code was duplicated across components with no single owner.' }
          ]},
          { heading: 'What I did', items: [
            { text: 'Extracted a reusable, NuGet-packaged communication object so every component shared one tested transport implementation.' },
            { text: 'Introduced a Publisher/Subscriber pattern to decouple message producers from consumers.' },
            { text: 'Resolved the concurrency defects through correct use of SynchronizationContext, ConfigureAwait and the Task Scheduler.' }
          ]}
        ],
        stack: ['C#', '.NET', 'TCP/IP', 'Pub/Sub', 'NuGet', 'async/await']
      },
      {
        icon: 'i-cloud',
        title: 'Distributed remote-access architecture',
        context: 'KLA Co. · production system',
        desc: 'Moved client–server communication from localhost-only to a ' +
              'network-configurable architecture, keeping the UI responsive with ' +
              'async/await throughout.',
        tags: ['.NET', 'async/await', 'Networking'],
        sections: [
          { heading: 'The problem', items: [
            { text: 'Client and server could only talk over localhost, so the inspection software could not be operated remotely.' }
          ]},
          { heading: 'What I did', items: [
            { text: 'Re-architected the communication path to accept a configurable server IP, making the deployment genuinely distributed.' },
            { text: 'Converted blocking calls to async/await and non-blocking operations so the WPF UI stays responsive across network latency.' }
          ]}
        ],
        stack: ['.NET', 'WPF', 'async/await', 'Networking', 'TCP/IP']
      },
      {
        icon: 'i-layers',
        title: 'Production log refactor',
        context: 'KLA Co. · internal tooling',
        desc: 'Redesigned a tightly-coupled legacy logging module around the Mediator ' +
              'pattern, cutting complexity and resolving blocking and concurrency issues.',
        tags: ['Mediator', 'Refactoring', 'Concurrency'],
        sections: [
          { heading: 'The problem', items: [
            { text: 'A legacy logging module was tightly coupled to its callers, hard to reason about, and the source of blocking and concurrency issues in production.' }
          ]},
          { heading: 'What I did', items: [
            { text: 'Ran a full documentation and debugging review to map actual behaviour before changing anything.' },
            { text: 'Redesigned the module around the Mediator pattern to reduce coupling and complexity.' },
            { text: 'Resolved the underlying blocking and concurrency defects as part of the rewrite.' }
          ]}
        ],
        stack: ['C#', 'Mediator pattern', 'Refactoring', 'Concurrency']
      },
      {
        icon: 'i-check',
        title: 'Firmware version checker',
        context: 'KLA Co. · production feature',
        desc: 'Delivered an asynchronous firmware version-check feature from ' +
              'requirements through to production validation, with dedicated test coverage.',
        tags: ['async/await', 'Testing', 'Firmware'],
        sections: [
          { heading: 'What I did', items: [
            { text: 'Owned the feature end to end: gathered and clarified requirements, then implemented an asynchronous firmware version check.' },
            { text: 'Wrote dedicated unit and integration tests, then validated the behaviour on production machines.' }
          ]}
        ],
        stack: ['C#', 'async/await', 'Unit testing', 'Integration testing']
      },
      {
        icon: 'i-database',
        title: 'Proxy provider application',
        context: 'TU Chemnitz · academic, 2019',
        desc: 'Retrieved and stored live data from multiple proxy providers via RSS ' +
              'feeds and APIs into SQL, exposed to the frontend through a custom REST API.',
        tags: ['ASP.NET Core MVC', 'REST API', 'SQL'],
        sections: [
          { heading: 'What I built', items: [
            { text: 'An application that automatically retrieved live data from multiple proxy providers via RSS feeds and APIs.' },
            { text: 'Persisted the collected data into a SQL database on a scheduled basis.' },
            { text: 'Exposed it to the frontend through a custom REST API built on ASP.NET Core MVC.' }
          ]}
        ],
        stack: ['ASP.NET Core MVC', 'C#', 'REST API', 'SQL', 'RSS']
      },
      {
        icon: 'i-award',
        title: 'Fingerprint & signature verification',
        context: 'IIU Islamabad · academic, 2015',
        desc: "C# desktop application verifying fingerprints and signatures through " +
              "image processing, reaching 97% accuracy — ~25% above the university's own system.",
        tags: ['C#', 'WinForms', 'Image processing'],
        sections: [
          { heading: 'What I built', items: [
            { text: 'A C# desktop application that verifies identity from both fingerprints and handwritten signatures using image-processing techniques.' },
            { text: 'Reached 97% accuracy — roughly 25% higher than the system the university was using at the time.' }
          ]}
        ],
        stack: ['C#', 'WinForms', 'Image processing', 'Biometrics']
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
      { name: 'C# Essential Training 1: Types and Control Flow', source: 'LinkedIn Learning · 2024' },
      { name: 'Advanced C#: LINQ, Dynamic Types, Extension Methods & Tuples', source: 'LinkedIn Learning · 2024' },
      { name: 'Microsoft Azure Administrator (AZ-104)', source: 'Microsoft', status: 'In Progress' },
      { name: 'Microsoft Azure DevOps Engineer Expert (AZ-400)', source: 'Microsoft', status: 'Planned' },
      { name: 'Microsoft Azure AI Cloud Developer Associate (AI-200)', source: 'Microsoft', status: 'Planned' }
    ],

    languages: [
      { name: 'English', level: 'Fluent' },
      { name: 'German',  level: 'Intermediate' },
      { name: 'Urdu',    level: 'Native' }
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
