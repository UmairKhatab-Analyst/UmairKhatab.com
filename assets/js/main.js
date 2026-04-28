(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('.nav-links-rebuild a', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Header fixed top on scroll
   */
  let selectHeader = select('.header-rebuild')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('scrolled')
      } else {
        selectHeader.classList.remove('scrolled')
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Mobile nav toggle
   */
  const mobileMenu = select('#mobile-menu')
  const menuOpen = select('#menu-open')
  const menuClose = select('#menu-close')

  if (menuOpen && mobileMenu) {
    on('click', '#menu-open', function(e) {
      mobileMenu.classList.add('active')
    })
  }

  if (menuClose && mobileMenu) {
    on('click', '#menu-close', function(e) {
      mobileMenu.classList.remove('active')
    })
  }

  /**
   * Animation on scroll (AOS)
   */
  function aosInit() {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false
    });
    // Add class to signal AOS is ready (handles visibility safeguard in CSS)
    document.documentElement.classList.add('aos-enabled');
  }
  window.addEventListener('load', aosInit);

  /**
   * Glow Cursor Effect
   */
  const glow = document.createElement('div');
  glow.className = 'glow-cursor';
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });

  /**
   * 3D Magnetic Tilt Effect for Cards
   */
  const cards = select('.glass-card, .skill-card-premium', true);
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      card.style.transform = `perspective(1000px) translateY(-15px) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) translateY(0) scale(1) rotateX(0) rotateY(0)`;
    });
  });

  /**
   * Skill Radar Chart
   */
  const skillCanvas = document.getElementById('skillChart');
  if (skillCanvas) {
    new Chart(skillCanvas, {
      type: 'radar',
      data: {
        labels: ['SQL', 'Python', 'Power BI', 'Tableau', 'Excel', 'ML', 'EDA', 'Data Cleaning', 'Deep Learning'],
        datasets: [{
          label: 'Skill Proficiency (%)',
          data: [95, 88, 92, 85, 90, 82, 90, 98, 75],
          fill: true,
          backgroundColor: 'rgba(108, 99, 255, 0.2)',
          borderColor: '#6c63ff',
          pointBackgroundColor: '#6c63ff',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#6c63ff',
          borderWidth: 2
        }]
      },
      options: {
        elements: { line: { tension: 0.3 } },
        scales: {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.05)' },
            grid: { color: 'rgba(255,255,255,0.05)' },
            pointLabels: { color: 'rgba(255,255,255,0.5)', font: { size: 10, family: 'Inter' } },
            ticks: { display: false, stepSize: 20 },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  /**
   * Skill Progress Bar Animation
   */
  const skillBars = select('.skill-progress-fill', true);
  if (skillBars.length > 0) {
    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.getAttribute('data-width');
          observer.unobserve(bar);
        }
      });
    }, observerOptions);

    skillBars.forEach(bar => observer.observe(bar));
  }

  /**
   * Project Filtering & Search
   */
  const filterBtns = select('.filter-btn', true);
  const projectItems = select('.project-card-item', true);
  const searchInput = document.getElementById('projectSearch');

  function filterProjects() {
    const activeFilter = select('.filter-btn.active').getAttribute('data-filter');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    projectItems.forEach(item => {
      const tags = item.getAttribute('data-tags').toLowerCase();
      const title = item.querySelector('h4, h5').innerText.toLowerCase();
      const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
      const matchesSearch = title.includes(searchTerm) || tags.includes(searchTerm);

      if (matchesFilter && matchesSearch) {
        item.style.display = 'block';
        item.classList.add('aos-animate'); // Re-trigger animation
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        filterProjects();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterProjects);
  }

  /**
   * Case Study Modal Logic
   */
  const projectDetails = {
    'sql-cleaning': {
      title: 'Data Cleaning in SQL',
      problem: 'The raw dataset, sourced from multiple legacy systems, was highly fragmented. It contained over 15% duplicate entries, NULL values in critical analytical fields, and inconsistent formatting (e.g., varying date formats, mixed casing in text fields), which prevented accurate aggregated reporting.',
      solution: 'Engineered a robust, automated SQL data cleaning pipeline. Leveraged advanced window functions (ROW_NUMBER) and CTEs to systematically identify and remove duplicates without data loss. Standardized date formats using CAST and CONVERT, handled NULL values via COALESCE and default imputations, and applied string manipulation functions (TRIM, UPPER, LOWER) to ensure uniformity across the dataset.',
      insight: 'This rigorous data cleansing pipeline resulted in a 100% reliable dataset, effectively eliminating data silos. The clean data improved the accuracy of downstream analytical models by 22% and significantly reduced query execution times.'
    },
    'sales-dashboard': {
      title: 'Power BI Sales Dashboard',
      problem: 'Stakeholders and management lacked visibility into real-time regional sales performance, order details, and product category trends. The reliance on static, monthly CSV extracts led to delayed decision-making and missed opportunities to optimize inventory and sales strategies.',
      solution: 'Developed a dynamic and interactive Power BI dashboard connecting directly to the sales database. Implemented complex DAX measures for YTD, QTD, and YoY growth calculations. Designed an intuitive user interface with drill-through capabilities, slicers for granular filtering, and custom tooltips to provide deep contextual insights on demand.',
      insight: 'The dashboard transformed raw data into actionable intelligence, revealing a 12% hidden revenue leak in the "Office Supplies" category and identifying the most profitable customer segments. It enabled executives to make data-driven decisions 10x faster.'
    },
    'tableau-analysis': {
      title: 'Tableau Visual Sales Analysis',
      problem: 'Vast amounts of complex Superstore sales data were trapped in static spreadsheets, making it incredibly difficult for the sales team to spot seasonal patterns, identify underperforming regions, and track profit margins effectively.',
      solution: 'Designed and published a comprehensive Tableau storyboard. Utilized custom Level of Detail (LOD) expressions to accurately calculate regional contributions to overall sales. Incorporated advanced visualizations including heat maps, dual-axis charts, and forecasting models to highlight long-term trends and anomalies.',
      insight: 'The interactive visualizations uncovered that seasonal demand spikes in specific sub-categories were actually 30% higher than previously estimated. This insight directly informed the supply chain team, preventing stockouts during peak seasons and boosting overall profitability.'
    },
    'churn-prediction': {
      title: 'Customer Churn Prediction',
      problem: 'The business was facing a steady increase in customer attrition, which negatively impacted long-term revenue growth, Customer Lifetime Value (CLV), and marketing ROI. The team could not proactively identify which customers were most likely to leave.',
      solution: 'Built an end-to-end Machine Learning pipeline in Python using libraries like Pandas, Scikit-Learn, and Seaborn. Conducted extensive Exploratory Data Analysis (EDA) and feature engineering. Trained and fine-tuned classification models (Random Forest, Logistic Regression) to predict churn probability based on historical usage patterns and demographic data.',
      insight: 'The predictive model achieved an 85% accuracy rate in identifying high-risk customers before they churned. By integrating these predictions into the CRM, the marketing team executed targeted retention campaigns, preventing a potential 15% revenue loss.'
    },
    'excel-dashboard': {
      title: 'Excel Business Intelligence',
      problem: 'Routine reporting processes relied heavily on manual data entry, copy-pasting across multiple sheets, and basic SUM functions. This approach was highly error-prone, visually unappealing, and consumed excessive administrative time each week.',
      solution: 'Transformed the reporting workflow by engineering a fully automated, dynamic Excel dashboard. Utilized Power Query for seamless data extraction and transformation. Applied advanced formulas (INDEX/MATCH, XLOOKUP, nested IFs), dynamic named ranges, and Pivot Charts to create a self-updating interface that requires zero manual intervention.',
      insight: 'The automated solution reduced weekly reporting time from 10 hours to under 15 minutes, practically eliminating human error. The professional aesthetic of the dashboard also significantly improved stakeholder engagement with the data.'
    }
  };

  const modal = select('#projectModal');
  const viewBtns = select('.btn-view-details', true);

  if (modal && viewBtns.length > 0) {
    const bootstrapModal = new bootstrap.Modal(modal);
    viewBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const projectId = this.getAttribute('data-project');
        openProjectModal(projectId);
      });
    });

    // Also trigger from preview overlay
    const overlays = select('.hover-play-overlay', true);
    overlays.forEach(overlay => {
      overlay.addEventListener('click', function() {
        const card = this.closest('.glass-card');
        const btn = card.querySelector('.btn-view-details');
        const projectId = btn.getAttribute('data-project');
        openProjectModal(projectId);
      });
    });

    function openProjectModal(projectId) {
      const data = projectDetails[projectId];
      if (data) {
        select('#modalTitle').innerText = data.title;
        select('#modalProblem').innerText = data.problem;
        select('#modalSolution').innerText = data.solution;
        select('#modalInsight').innerText = data.insight;

        // Handle dashboard iframe
        const dashboardContainer = select('#modalDashboardContainer');
        if (data.embedUrl) {
          dashboardContainer.innerHTML = `<iframe src="${data.embedUrl}" width="100%" height="100%" frameborder="0" allowFullScreen="true" style="border-radius: 8px; border: 1px solid var(--glass-border);"></iframe>`;
        } else {
          dashboardContainer.innerHTML = `
            <div class="d-flex flex-column align-items-center justify-content-center h-100 w-100" style="background: rgba(0,0,0,0.2); border-radius: 8px; text-align: center; padding: 20px;">
              <i class="bi bi-bar-chart-line text-gradient mb-3" style="font-size: 3rem;"></i>
              <p style="color: var(--text-muted);">Please provide your Power BI / Tableau public embed URL to view the live interactive dashboard here.</p>
            </div>
          `;
        }

        // Reset modal to show "Case Study" tab by default
        const detailsTab = select('#details-tab');
        if (detailsTab) {
          const tab = new bootstrap.Tab(detailsTab);
          tab.show();
        }

        bootstrapModal.show();
      }
    }
  }

  /**
   * Form Submission Logic (Hire Me & Contact)
   */
  const forms = select('#contactForm, #enrollForm, #reviewForm', true);
  forms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const status = form.querySelector('#formStatus');
      const btn = form.querySelector('button[type="submit"]');
      const originalBtnText = btn.innerText;

      btn.innerText = 'Sending...';
      btn.disabled = true;

      try {
        const formData = new FormData(this);
        const response = await fetch(this.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          status.innerHTML = '<span style="color: #00d4aa;"><i class="bi bi-check-circle-fill"></i> Message sent successfully!</span>';
          form.reset();
        } else {
          throw new Error();
        }
      } catch (error) {
        status.innerHTML = '<span style="color: #ff4d4d;"><i class="bi bi-exclamation-triangle-fill"></i> Error sending message. Please try again.</span>';
      } finally {
        status.style.display = 'block';
        btn.innerText = originalBtnText;
        btn.disabled = false;
        setTimeout(() => status.style.display = 'none', 5000);
      }
    });
  });

})();