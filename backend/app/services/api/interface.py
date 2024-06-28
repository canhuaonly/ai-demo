import typing

# from models.api_models import ProjectInfo, ModuleInfo
from app.utils.response.codes import CodeEnum
from app.exceptions.exceptions import ParameterError
from app.schemas.api.interface import InterfaceQuery, InterfaceIn, InterfaceId


class InterfaceService:

    @staticmethod
    async def list(params: InterfaceQuery) -> typing.Dict:
        """
        获取项目列表
        :param params:
        :return:
        """
        # data = await ProjectInfo.get_list(params)
        # return data
        res = [{"id": 1, "name": "chonly", "test_user": "chonly"}]
        return res

    @staticmethod
    async def wenxin_api(params: InterfaceQuery) -> typing.Dict:
        """
        文心一言接口
        :param params:
        :return:
        """
        # data = await ProjectInfo.get_list(params)
        # return data
        res = [{"id": 1, "name": "chonly", "test_user": "chonly"}]
        return res

    @staticmethod
    async def get_all() -> typing.Dict:
        """
        获取项目列表
        :return:
        """
        # data = await ProjectInfo.get_all()
        # return data
        return None

    @staticmethod
    async def save_or_update(params: InterfaceIn) -> typing.Dict:
        """
        更新保存项目
        :param params:
        :return:
        """
        # if params.id:
        #     project_info = await ProjectInfo.get(params.id)
        #     if project_info.name != params.name:
        #         if await ProjectInfo.get_project_by_name(params.name):
        #             raise ParameterError(CodeEnum.PROJECT_NAME_EXIST)
        # else:
        #     if await ProjectInfo.get_project_by_name(params.name):
        #         raise ParameterError(CodeEnum.PROJECT_NAME_EXIST)

        # return await ProjectInfo.create_or_update(params.dict())
        return None

    @staticmethod
    async def deleted(params: InterfaceId) -> int:
        """
        删除项目
        :param params:
        :return:
        """
        # relation_module = await ModuleInfo.get_module_by_project_id(params.id)
        # if relation_module:
        #     raise ParameterError(CodeEnum.PROJECT_HAS_MODULE_ASSOCIATION)
        # return await ProjectInfo.delete(params.id)
        return None

    @staticmethod
    async def get_project_tree() -> typing.List:
        # project_list = await ProjectInfo.get_all()
        # module_list = await ModuleInfo.get_all()

        # project_tree_list = []

        # for project in project_list:
        #     project["children"] = []
        #     project["disabled"] = True
        #     if module_list:
        #         for module in module_list:
        #             if module["project_id"] == project["id"]:
        #                 project["children"].append(module)
        #                 project["disabled"] = False
        #     project_tree_list.append(project)
        # return project_tree_list
        return None
