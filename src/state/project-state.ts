namespace App {
  type Listener<T> = (items: T[]) => void;

  class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
      this.listeners.push(listenerFn);
    }
  }

  export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
      super();
    }

    static getInstance() {
      if (this.instance) return this.instance;

      this.instance = new ProjectState();
      return this.instance;
    }

    addProject(title: string, desc: string, numOfPeople: number) {
      const newProject = new Project(
        Math.random().toString(),
        title,
        desc,
        numOfPeople,
        ProjectStatus.Active
      );

      this.projects.push(newProject);
      this.updateListener();
    }

    moveProject(prjId: string, newStatus: ProjectStatus) {
      const project = this.projects.find((prj) => prj.id === prjId);
      if (project && project.status !== newStatus) {
        project.status = newStatus;
        this.updateListener();
      }
    }

    private updateListener() {
      for (const listenerFn of this.listeners) {
        listenerFn(this.projects.slice());
      }
    }
  }

  export const projectState = ProjectState.getInstance();
}
