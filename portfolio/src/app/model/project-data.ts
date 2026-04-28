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
    title: 'Washington Employment',
    description: "An informative site referencing government data on Washington State employment.",
    folder:'washington-employment',
    previewImage:'assets/rasters/placeholder.png',
    tags:['JavaScript','CSS3','HTML5'],
    artifacts:[],
    githubLink:''
  },
  {
    id: 2,
    title: 'Portfolio',
    description: "This portfolio that is currently open.",
    folder:'portfolio',
    previewImage:'assets/rasters/placeholder.png',
    tags:['TypeScript','Angular','CSS3','HTML'],
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