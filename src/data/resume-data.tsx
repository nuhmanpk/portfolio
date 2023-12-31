import { GitHubIcon, LinkedInIcon, XIcon, InstagramIcon, KaggleIcon, MediumIcon, StackOverFlow } from "@/components/icons";

export const RESUME_DATA = {
  name: "Nuhman PK",
  initials: "Pk",
  location: "Malappuram, Kerala",
  locationLink: "https://www.google.com/maps/place/Malappuram",
  about:
    "Full Stack Engineer focused on building scalable products with passion and a knack for translating complex challenges into elegant solutions",
  summary:
    "I am a passionate Full Stack Developer with expertise in various technologies and a strong focus on building scalable applications. I have a solid background in Machine Learning (ML), particularly in areas like Computer Vision, Deep Learning, and Neural Networks. My technical skills extend to frameworks such as Node.js, Angular, React, Flask, and Express.js. With a keen interest in open-source technology, I actively contribute to projects on GitHub, showcasing my commitment to collaboration and innovation. Feel free to explore my work ",
  personalWebsiteUrl: "https://nuhmanpk.github.io/portfolio",
  contact: {
    email: "nuhmanpk7@gmail.com",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/nuhmanpk",
        icon: GitHubIcon,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/nuhmanpk/",
        icon: LinkedInIcon,
      },
      {
        name: "X",
        url: "https://x.com/pk__nuhman",
        icon: XIcon,
      },
      {
        name: "Instagram",
        url: "https://instagram.com/nuhman_pk",
        icon: InstagramIcon,
      },
      {
        name: "Kaggle",
        url: "https://kaggle.com/nuhmanpk",
        icon: KaggleIcon,
      },
      {
        name: "Medium",
        url: "https://medium.com/@nuhmanpk",
        icon: MediumIcon,
      },
      {
        name: "StackOverflow",
        url: "https://stackoverflow.com/users/16388290/nuhman-pk",
        icon: StackOverFlow,
      },
    ],
  },
  education: [
    {
      school: "College of Applied Science",
      degree: "Bachelor's Degree in Computer Science",
      start: "2019",
      end: "2022",
    },
  ],
  work: [
    {
      company: "Bititude",
      link: "https://bititude.com",
      badges: ["Remote"],
      title: "Full Stack Developer",
      start: "2022",
      end: "Present",
      description:"",
    },
    {
      company: "Open Source Contributor",
      link: "https://github.com/nuhmanpk",
      badges: ["Hobby Dev"],
      title: "Contributor",
      start: "2019",
      end: "Present",
      description:
        "My journey thrives on GitHub contributions and transformative projects, like cutting-edge Telegram bots revolutionizing communication and widely acclaimed PyPI packages simplifying complex tasks for over 80,000 developers. Fostering a vibrant open source community where ideas spark and collaborations flourish, I push boundaries in this fast-paced landscape, contributing to the collective knowledge and leaving a lasting legacy of impact.",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "Angular",
    "Python",
    "Machine Learning",
    "FastAPI",
    "Telegram Bot Frameworks",
    "Computervision"
  ],
  projects: [
    {
      title: "YoutubeTags",
      techStack: [
        "Python", "Side Project", "Open Source", "Pypi Package"
      ],
      description: "YoutubeTags is a YouTube SEO tool to Extract YouTube Video Tags without YouTube API. Capable to extract Video and Channel Tags. With more than 50k+ downloads from pypi.org",
      link: {
        label: "https://pypi.org/project/YoutubeTags/",
        href: "https://pypi.org/project/YoutubeTags/",
      },
    },
    {
      title: "Super Logger",
      techStack: ["Side Project", "Open Source", "VsCode Extension"],
      description:
        "Super Logger is a versatile Visual Studio Code extension that enhances your coding experience across various programming languages. It provides entertaining and informative print statements with random emojis and jokes, making debugging a delightful and effective process.",
      link: {
        label: "https://marketplace.visualstudio.com/items?itemName=nuhmanpk.superlogger",
        href: "https://marketplace.visualstudio.com/items?itemName=nuhmanpk.superlogger",
      },
    },
    {
      title: "Telegram Bots",
      techStack: ["Side Project", "Python", "Pyrogram", "MongoDB"],
      description: "Unlock a world of automated efficiency with my wide range of Telegram bots, expertly crafted for specific tasks and built to seamlessly scale",
      link: {
        label: "github.com/nuhmanpk",
        href: "https://github.com/nuhmanpk",
      },
    },
    {
      title: "generateApiKey",
      techStack: ["Python", "Side Project", "Open Source", "Pypi Package"],
      description:
        "This package provides a convenient way to generate API keys using a secret, seed, and an optional include keyword. The generated keys are unique and secure, making them suitable for use in a variety of applications. With more than 1k+ downloads from pypi.org .The package supports generating API keys using a variety of methods such as UUID v5 and SHA-256 algorithm. The keys are generated using a combination of seed, secret, and include keyword. Additionally, the package allows you to insert the include keyword at a random position in the seed which will make it more difficult to guess.",
      link: {
        label: "https://pypi.org/project/generateApiKey/",
        href: "https://pypi.org/project/generateApiKey/",
      },
    },
    {
      title: "Webtrench",
      techStack: ["Python", "Side Project", "Open Source", "Pypi Package"],
      description:
        "A powerful and easy-to-use web scrapper for collecting data from the web. Supports scraping of images, text, videos, meta data, and more. Ideal for machine learning and deep learning engineers. Download and extract data with just one line of code",
      link: {
        label: "https://pypi.org/project/Webtrench/",
        href: "https://pypi.org/project/Webtrench/",
      },
    },
    {
      title: "CV2Filters",
      techStack: ["Python", "Side Project", "Open Source", "Pypi Package"],
      description:
        "CV2Filters simplifies image processing tasks by providing a high-level abstraction of the underlying OpenCV functionality. As an OpenCV wrapper and a Python package available on PyPI, CV2Filters empowers users of all skill levels to explore the fascinating world of image manipulation. With CV2Filters, you can perform a wide range of tasks, including reading and resizing images, applying filters, detecting edges, reducing noise, and much more. By abstracting away the complexities of OpenCV, CV2Filters makes image processing accessible and enjoyable for everyone",
      link: {
        label: "useminimal.com",
        href: "https://useminimal.com/",
      },
    }
  ], publications: [
    {
      title: "Supercharge Your Web Development: Real-Time HTML Rendering on All Devices",
      techStack: ["Sep 13, 2023"],
      description: "",
      link: {
        label: "medium.com",
        href: "https://nuhmanpk.medium.com/supercharge-your-web-development-real-time-html-rendering-on-all-devices-with-vs-code-live-server-56921c1d100",
      },
    },
    {
      title: "Extracting YouTube Tags Made Easy: Introducing YoutubeTags Python API Wrapper",
      techStack: ["Jul 23, 2023"],
      description: "",
      link: {
        label: "medium.com",
        href: "https://medium.com/@nuhmanpk/extracting-youtube-tags-made-easy-introducing-youtubetags-python-api-wrapper-c3bd3416d5fc",
      },
    },
    {
      title: "A Comprehensive Guide to cv2filters: A Powerful OpenCV Wrapper for Image Preprocessing",
      techStack: ["Jul 23, 2023"],
      description: "",
      link: {
        label: "medium.com",
        href: "https://medium.com/@nuhmanpk/a-comprehensive-guide-to-cv2filters-a-powerful-opencv-wrapper-for-image-preprocessing-80c25c897f53",
      },
    }
  ], certifications: [
    {
      title: "Pytorch for Deep Leaning",
      techStack: ["Udemy", "Feb 2023"],
      description: "",
      link: {
        label: "udemy.com",
        href: "https://www.udemy.com/certificate/UC-db3422ce-789f-4ee3-b95d-e0c17cc8a6a5/",
      },
    },
    {
      title: "Machine Learning",
      techStack: ["Kaggle", "Apr 2023"],
      description: "",
      link: {
        label: "kaggle.com",
        href: "https://www.kaggle.com/learn/certification/nuhmanpk/intro-to-machine-learning",
      },
    },
    {
      title: "Advanced SQL",
      techStack: ["Kaggle", "Jul 2023"],
      description: "",
      link: {
        label: "kaggle.com",
        href: "https://www.kaggle.com/learn/certification/nuhmanpk/advanced-sql",
      },
    },
    {
      title: "Build CNN with TensorFlow and Keras",
      techStack: ["Kaggle", "Spe 2023"],
      description: "",
      link: {
        label: "kaggle.com",
        href: "https://www.kaggle.com/learn/certification/nuhmanpk/computer-vision",
      },
    },
    {
      title: "Transformer Models and BERT Model",
      techStack: ["Google", "Dec 2023"],
      description: "",
      link: {
        label: "https://www.cloudskillsboost.google/",
        href: "https://www.cloudskillsboost.google/public_profiles/350fa77e-4886-46b4-9d62-3910f47ba55c/badges/6651890",
      },
    },
    {
      title: "Introduction to Image Generation",
      techStack: ["Google", "Dec 2023"],
      description: "",
      link: {
        label: "https://www.cloudskillsboost.google/",
        href: "https://www.cloudskillsboost.google/public_profiles/350fa77e-4886-46b4-9d62-3910f47ba55c/badges/6643394",
      },
    },
    {
      title: "Attention Machanism",
      techStack: ["Google", "Dec 2023"],
      description: "",
      link: {
        label: "https://www.cloudskillsboost.google/",
        href: "https://www.cloudskillsboost.google/public_profiles/350fa77e-4886-46b4-9d62-3910f47ba55c/badges/6643540",
      },
    },

  ]
} as const;
