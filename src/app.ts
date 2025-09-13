enum ProjectStatus {
  Active,
  Finished,
}

type Listener<T> = (items: T[]) => void;

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
class ProjectState extends State<Project> {
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

    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}
const projectState = ProjectState.getInstance();

function validate(validatableInput: Validatable) {
  let isValid = true;
  const { value, required, minLength, maxLength, min, max } = validatableInput;

  if (required) isValid = isValid && value.toString().trim().length !== 0;

  if (minLength != null && typeof value === "string")
    isValid = isValid && value.length >= minLength;

  if (maxLength != null && typeof value === "string")
    isValid = isValid && value.length <= maxLength;

  if (min != null && typeof value === "number")
    isValid = isValid && value >= min;

  if (max != null && typeof value === "number")
    isValid = isValid && value <= max;

  return isValid;
}

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return adjDescriptor;
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  newEl: U;

  constructor(
    templateElId: string,
    hostElId: string,
    insertAtStart: boolean,
    newElId?: string
  ) {
    this.templateEl = document.getElementById(
      templateElId
    ) as HTMLTemplateElement;
    this.hostEl = document.getElementById(hostElId) as T;
    const importedNode = document.importNode(this.templateEl.content, true);
    this.newEl = importedNode.firstElementChild as U;
    if (newElId) this.newEl.id = newElId;

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostEl.insertAdjacentElement(
      insertAtStart === true ? "afterbegin" : "beforeend",
      this.newEl
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  configure() {
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") return prj.status === ProjectStatus.Active;
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.newEl.querySelector("ul")!.id = listId;
    this.newEl.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    ) as HTMLUListElement;

    listEl.innerHTML = "";

    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement("li");
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl!: HTMLInputElement;
  descriptionInputEl!: HTMLInputElement;
  peopleInputEl!: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.configure();
  }

  configure() {
    this.titleInputEl = this.newEl.querySelector("#title") as HTMLInputElement;
    this.descriptionInputEl = this.newEl.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputEl = this.newEl.querySelector(
      "#people"
    ) as HTMLInputElement;
    this.newEl.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value;
    const enteredDescription = this.descriptionInputEl.value;
    const enteredPeople = this.peopleInputEl.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid Input Please Try Again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputEl.value = "";
    this.descriptionInputEl.value = "";
    this.peopleInputEl.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
