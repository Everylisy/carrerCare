import is from "@sindresorhus/is";
import {Router} from "express";
import {login_required} from "../middlewares/login_required";
import {projectService} from "../services/projectService";

const projectRouter = Router();
projectRouter.use(login_required);

  /*
   * project 생성
   * post 요청 - /project/create
   */
  projectRouter.post("/project/create", async function (req, res, next) {
    try {
      if (is.emptyObject(req.body)) {
        throw new Error(
          "headers의 Content-Type을 application/json으로 설정해주세요"
        );
      }
  
      // req (request) 에서 데이터 가져오기
      const user_id = req.body.user_id;
      const title = req.body.title;
      const description = req.body.description;
      const from_date = req.body.from_date;
      const to_date = req.body.to_date;
  
      // 위 데이터를 프로젝트 db에 추가하기
      const newProject = await projectService.addProject({
        user_id,
        title,
        description,
        from_date,
        to_date,
      });
      console.log(newProject);
      if (newProject.errorMessage) {
        throw new Error(newProject.errorMessage);
      }
  
      res.status(201).json(newProject);
    } catch (error) {
      next(error);
    }
  });

  /*
   * project id별 조회
   * post 요청 - /projects/:id
   */
  projectRouter.get("/projects/:id", async function (req, res, next) {
    try {
        // url로부터 project_Id 를 추출함.
        const projectId = req.params.id;
        const currentProject = await projectService.getProject({projectId});
  
        if (currentProject.errorMessage) {
          throw new Error(currentProject.errorMessage);
        }
  
        res.status(200).send(currentProject);
        console.log(currentProject);
    } catch (error) {
      next(error);
    }
  });

  /*
   * project 수정
   * put 요청 - /projects/:id
   */
  projectRouter.put("/projects/:id", async function (req, res, next){
    try {
      // url로부터 project_Id 를 추출함.
      const projectId = req.params.id;

      // body data 로부터 업데이트할 project 정보를 추출함.
      const title = req.body.title ?? null;
      const description = req.body.description ?? null;
      const from_date = req.body.from_date ?? null;
      const to_date = req.body.to_date ?? null;

      console.log(title, description, from_date, to_date)
      const toUpdate = {title, description, from_date, to_date};

      // 해당 project 아이디로 사용자 정보를 db에서 찾아 업데이트함. 바뀐 부분 없으면 생략한다.
      const Project = await projectService.setProject({projectId, toUpdate});

      if (toUpdate.errorMessage) {
        throw new Error(Project.errorMessage);
      }
      res.status(200).json(Project);
    } catch (error) {
      next(error);
    }
  });

  /*
   * projectlist 조회
   * get 요청 - /projectlist/:user_id
   */
  projectRouter.get("/projectlist/:user_id", async function (req, res, next){
    try {
      const user_id = req.params.user_id;
      const projectList=await projectService.getProjectList({user_id});
      res.status(200).send(projectList);
    } catch (error) {
      next(error);
    }
  });

  export {projectRouter};