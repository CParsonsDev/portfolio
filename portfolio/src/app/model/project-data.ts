export interface ProjectData {
  id: number;
  title: string;
  description: string;
  folder: string;
  previewImage: string;
  tags: string[];
  artifacts?: string[];
  githubLink?: string;
}

export const PROJECT_DATA: ProjectData[] = [
  {
    id: 1,
    title: 'State Information Reference Website',
    description: "This website provides comprehensive information about the state of Washington, including data on employment, education, and unique features of the state. The website is designed to be user-friendly and accessible, with a clean and simple interface that allows users to easily navigate and find the information they need.\nThis site was originally created as an assignment for a web development course, and its styling in particular matches the original design as closely as possible. The website is built using JavaScript, CSS3, and HTML5, and it features a responsive design that allows it to be accessed on a variety of devices, including desktops, tablets, and smartphones.",
    folder:'washington-employment',
    previewImage:'assets/rasters/washington-employment-preview.gif',
    tags:['JavaScript','CSS3','HTML5'],
    artifacts:['assets/project-artifacts/washington-employment-artifacts/index-wireframe.svg','assets/project-artifacts/washington-employment-artifacts/city-wireframe.svg'],
    githubLink:''
  },
  {
    id: 2,
    title: 'Parametric Graphics Processing Application',
    description: "This application allows users to manipulate a variety of parameters to create unique graphics processing effects. The application is built using JavaScript and features a user-friendly interface that allows users to easily adjust parameters and see the results in real-time.\nThis application is currently in development. The goal is to create an efficient and visually appealing graphics processing tool that can be used for a variety of applications, including image editing, video processing, and more.",
    folder:'graphics-processing',
    previewImage:'assets/rasters/graphics-processing-preview.gif',
    tags:['JavaScript','CSS3','HTML5'],
    artifacts:[],
    githubLink:''
  }

  /* 
  {
    id: 0,
    title: '',
    description: "",
    folder:'',
    previewImage:'',
    tags:[],
    artifacts:[],
    githubLink:''
  }
    */
]