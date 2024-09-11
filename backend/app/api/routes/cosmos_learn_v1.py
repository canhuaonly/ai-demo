"""Cosmod DB 官网示例"""
import random
from fastapi import APIRouter

from app.cosmos import db

router = APIRouter()

#####################################################
# [C1] 创建/编辑用户
# [Q1] 检索用户
# [C2] 创建/编辑帖子
# [Q2] 检索帖子
# [Q3] 以短格式列出用户的帖子
# [C3] 创建评论
# [Q4] 列出帖子的评论
# [C4] 为帖子点赞
# [Q5] 列出帖子的点赞数
# [Q6] 以短格式列出最近创建的 x 个帖子（源）
#####################################################

#####################################################
# 用户容器 users
#  分区：id
# {
#     "id": "<user-id>",
#     "username": "<username>"
# }
#####################################################

#####################################################
# 帖子容器 posts
#  分区：type
# {
#     "id": "<post-id>",
#     "type": "post", # 帖子
#     "postId": "<post-id>",
#     "userId": "<post-author-id>",
#     "title": "<post-title>",
#     "content": "<post-content>",
#     "creationDate": "<post-creation-date>"
# }

# {
#     "id": "<comment-id>",
#     "type": "comment", # 评论
#     "postId": "<post-id>",
#     "userId": "<comment-author-id>",
#     "content": "<comment-content>",
#     "creationDate": "<comment-creation-date>"
# }

# {
#     "id": "<like-id>",
#     "type": "like", # 点赞
#     "postId": "<post-id>",
#     "userId": "<liker-id>",
#     "creationDate": "<like-creation-date>"
# }
#####################################################


# [C1] 创建/编辑用户
@router.post("/createUsers", description="创建用户")
async def create_users():
    """[C1] 创建/编辑用户"""
    # 容器
    container = db.get_container_client("demo_users")
    try:
        # 插入数据
        for i in range(1, 10000 + 1):
            user = get_user(f"user{i}", f"username{i}")
            container.create_item(body=user)
        # 返回数据
        return "数据插入成功10000条"
    except Exception as e:
        # return "数据插入失败" + str(e)
        raise ValueError("数据查询失败: " + str(e)) from e


# [Q1] 检索用户
@router.post("/searchUsers", description="检索用户")
async def search_users():
    """[Q1] 检索用户"""
    container = db.get_container_client("demo_users")
    try:
        # 查询数据
        users_it = container.query_items(
            query="SELECT * FROM users u WHERE u.id = @user_id",
            parameters=[{"name": "@user_id", "value": "user1"}],
            enable_cross_partition_query=True,
        )
        # 取得items对象
        users = [item for item in users_it]
        # 返回数据
        return users
        # return items
    except Exception as e:
        # return "数据查询失败" + str(e)
        raise ValueError("数据查询失败: " + str(e)) from e


# [C2] 创建/编辑帖子
@router.post("/createPosts", description="创建帖子")
async def create_posts():
    """[C2] 创建/编辑帖子"""
    container = db.get_container_client("demo_posts")
    try:
        # 插入数据
        for i in range(1, 100 + 1):
            # 每个用户发5~50个帖子
            post_cnt = random.randint(5, 50)
            for j in range(1, post_cnt + 1):
                post = get_post(
                    f"post{i}_{j}", f"user{i}", f"title{i}_{j}", f"content{i}_{j}"
                )
                container.create_item(body=post)
        # 用户user1发帖子,帖子id为post1_52~post1_246
        # for i in range(52, 246 + 1):
        #     post = get_post(f"post1_{i}", "user1", f"title1_{i}", f"content1_{i}")
        #     container.create_item(body=post)
        # 返回数据
        return "数据插入成功"
    except Exception as e:
        # return "数据插入失败" + str(e)
        raise ValueError("数据查询失败: " + str(e)) from e


# [Q2] 检索帖子
@router.post("/searchPosts", description="检索帖子")
async def search_posts():
    """[Q2] 检索帖子"""
    container = db.get_container_client("demo_posts")
    container_users = db.get_container_client("demo_users")
    try:
        # 查询数据
        # 查询帖子id为post1_1的帖子
        post_it = container.query_items(
            query="SELECT * FROM posts p WHERE p.id = @post_id",
            parameters=[{"name": "@post_id", "value": "post1_1"}],
            enable_cross_partition_query=True,
        )
        # 取得postIt的第一个元素为post对象
        post = next(iter(post_it))
        print(post)
        # 查询帖子id为post1_1的帖子的评论数
        comments_it = container.query_items(
            query="""
                SELECT
                    VALUE COUNT(1) 
                FROM
                    posts p 
                WHERE
                    p.postId = @post_id 
                    AND p.type = 'comment'
            """,
            parameters=[{"name": "@post_id", "value": "post1_1"}],
            enable_cross_partition_query=True,
        )
        # 取得comments对象
        comments = [item for item in comments_it]
        print(comments)
        post["commentCount"] = comments[0]
        # 查询帖子id为post1_1的帖子的点赞数
        likes_it = container.query_items(
            query="""
                SELECT
                    VALUE COUNT(1) 
                FROM
                    posts p 
                WHERE
                    p.postId = @post_id 
                    AND p.type = 'like'
            """,
            parameters=[{"name": "@post_id", "value": "post1_1"}],
            enable_cross_partition_query=True,
        )
        # 取得likes对象
        likes = [item for item in likes_it]
        print(likes)
        post["likeCount"] = likes[0]
        # 查询帖子发起者的用户名称
        user_it = container_users.query_items(
            query="SELECT u.username FROM users u WHERE u.id = @user_id",
            parameters=[{"name": "@user_id", "value": post["userId"]}],
            enable_cross_partition_query=True,
        )
        # 取得user对象
        user = [item for item in user_it]
        print(user)
        post["username"] = user[0]["username"]
        # 将帖子、评论、点赞、用户名称返回
        # return partner_success(posts)
        return post
    except Exception as e:
        # return "数据查询失败" + str(e)
        raise ValueError("数据查询失败: " + str(e)) from e


# [Q3] 以短格式列出用户的帖子
@router.post("/searchUserPosts", description="列出用户的帖子")
async def search_user_posts():
    """[Q3] 以短格式列出用户的帖子"""
    # 容器
    container = db.get_container_client("demo_posts")
    # 用户容器
    container_users = db.get_container_client("demo_users")
    # 数据查询的分页标记
    # continuation_token = None
    try:
        # 查询数据
        posts = []
        # 查询用户user1的帖子,取得对应的点赞数、评论数和用户名
        posts_it = container.query_items(
            query="SELECT * FROM posts p WHERE p.userId = @user_id",
            parameters=[{"name": "@user_id", "value": "user1"}],
            enable_cross_partition_query=True,
            # max_item_count=3,
            # continuation_token=continuation_token,
        )
        for post in posts_it:
            # 查询帖子的评论数
            comments_it = container.query_items(
                query="""
                    SELECT
                        VALUE COUNT(1) 
                    FROM
                        posts p 
                    WHERE
                        p.postId = @post_id 
                        AND p.type = 'comment'
                """,
                parameters=[{"name": "@post_id", "value": post["id"]}],
                enable_cross_partition_query=True,
            )
            comments = [item for item in comments_it]
            print(comments)
            post["commentCount"] = comments[0]
            # 查询帖子的点赞数
            likes_it = container.query_items(
                query="""
                    SELECT
                        VALUE COUNT(1) 
                    FROM
                        posts p 
                    WHERE
                        p.postId = @post_id 
                        AND p.type = 'like'
                """,
                parameters=[{"name": "@post_id", "value": post["id"]}],
                enable_cross_partition_query=True,
            )
            likes = [item for item in likes_it]
            print(likes)
            post["likeCount"] = likes[0]
            # 查询帖子发起者的用户名称
            user_it = container_users.query_items(
                query="SELECT * FROM users u WHERE u.id = @user_id",
                parameters=[{"name": "@user_id", "value": post["userId"]}],
                enable_cross_partition_query=True,
            )
            user = [item for item in user_it]
            print(user)
            post["username"] = user[0]["username"]
            print(post)
            # post对象放入集合
            posts.append(post)

        # 返回数据
        return posts
    except Exception as e:
        # return "数据查询失败" + str(e)
        raise ValueError("数据查询失败: " + str(e)) from e


# [C3] 创建评论
@router.post("/createComments", description="创建评论")
async def create_comments():
    """[C3] 创建评论"""
    container = db.get_container_client("demo_posts")
    try:
        # 插入数据
        # 查询所有帖子
        posts = container.query_items(
            query="SELECT p.postId FROM posts p WHERE p.type = 'post'",
            enable_cross_partition_query=True,
        )
        for post in posts:
            # 为每个帖子创建25条评论
            for i in range(1, 25 + 1):
                # 随机用户评论
                comment = get_comment(
                    f"comment{post['postId']}_{i}",
                    post["postId"],
                    f"user{random.randint(1, 100)}",
                    f"content{i}",
                )
                container.create_item(body=comment)
        # 返回数据
        return "数据插入成功"
    except Exception as e:
        # return "数据插入失败" + str(e)
        raise ValueError("数据查询失败: " + str(e)) from e


# [Q4] 列出帖子的评论
@router.post("/searchPostComments", description="列出帖子的评论")
async def search_post_comments():
    """[Q4] 列出帖子的评论"""
    container = db.get_container_client("demo_posts")
    try:
        # 查询数据
        comments = []
        # 查询帖子post1_1的评论
        comments_it = container.query_items(
            query="SELECT * FROM posts p WHERE p.postId = @post_id AND p.type = 'comment'",
            parameters=[{"name": "@post_id", "value": "post1_1"}],
            enable_cross_partition_query=True,
        )
        # 查询评论的用户名称
        for comment in comments_it:
            user_it = container.query_items(
                query="SELECT u.username FROM users u WHERE u.id = @user_id",
                parameters=[{"name": "@user_id", "value": comment["userId"]}],
                enable_cross_partition_query=True,
            )
            user = [item for item in user_it]
            comment["username"] = user[0]["username"]
            # comment对象放入集合
            comments.append(comment)
        # 返回数据
        return comments
    except Exception as e:
        # return "数据查询失败" + str(e)
        raise ValueError("数据查询失败: " + str(e)) from e


# [C4] 为帖子点赞
@router.post("/createLikes", description="为帖子点赞")
async def create_likes():
    """[C4] 为帖子点赞"""
    container = db.get_container_client("demo_posts")
    try:
        # 插入数据
        # 查询所有帖子
        posts = container.query_items(
            query="SELECT p.postId FROM posts p WHERE p.type = 'post'",
            enable_cross_partition_query=True,
        )
        for post in posts:
            # 为每个帖子创建100个点赞
            for i in range(1, 100 + 1):
                # 随机用户点赞
                like = {
                    "id": f"like{post['postId']}_{i}",
                    "type": "like",
                    "postId": post["postId"],
                    "userId": f"user{random.randint(1, 100)}",
                    "creationDate": "2024-07-16",
                }
                container.create_item(body=like)
        # 返回数据
        return "数据插入成功"
    except Exception as e:
        # return "数据插入失败" + str(e)
        raise ValueError("数据查询失败: " + str(e)) from e


# [Q5] 列出帖子的点赞数
@router.post("/searchPostLikes", description="列出帖子的点赞数")
async def search_post_likes():
    """[Q5] 列出帖子的点赞数"""
    container = db.get_container_client("demo_posts")
    container_users = db.get_container_client("demo_users")
    try:
        # 查询
        likes = []
        # 查询帖子post1_1的点赞用户
        likes_it = container.query_items(
            query="SELECT * FROM posts p WHERE p.postId = @post_id AND p.type = 'like'",
            parameters=[{"name": "@post_id", "value": "post1_1"}],
            enable_cross_partition_query=True,
        )
        # 查询点赞用户名称
        for like in likes_it:
            user_it = container_users.query_items(
                query="SELECT u.username FROM users u WHERE u.id = @user_id",
                # parameters=[{"name": "@user_id", "value": like["userId"]}],
                # # user不存在,插入数据存在问题，暂时注释
                parameters=[{"name": "@user_id", "value": "user1"}],
                enable_cross_partition_query=True,
            )
            user = [item for item in user_it]
            like["username"] = user[0]["username"]
            # like对象放入集合
            likes.append(like)
        # 返回数据
        return likes
    except Exception as e:
        # return "数据查询失败" + str(e)
        raise ValueError("数据查询失败: " + str(e)) from e


# [Q6] 以短格式列出最近创建的 x 个帖子（源）
@router.post("/searchRecentPosts", description="列出最近创建的 x 个帖子")
async def search_recent_posts():
    """[Q6] 以短格式列出最近创建的 x 个帖子（源）"""
    container = db.get_container_client("demo_posts")
    container_users = db.get_container_client("demo_users")
    try:
        # 查询数据
        posts = []
        # 查询最近创建的100个帖子
        posts_it = container.query_items(
            query="""
                SELECT 
                    TOP 100 * 
                FROM 
                    posts p 
                WHERE 
                    p.type = 'post' 
                ORDER BY 
                    p.creationDate DESC
            """,
            enable_cross_partition_query=True,
        )
        # 查询帖子的评论数、点赞数和用户名称
        for post in posts_it:
            print(post["id"])
            # 查询帖子的评论数
            comments_it = container.query_items(
                query="""
                    SELECT 
                        VALUE COUNT(1) 
                    FROM 
                        posts p 
                    WHERE 
                        p.postId = @post_id 
                        AND p.type = 'comment'
                """,
                parameters=[{"name": "@post_id", "value": post["id"]}],
                enable_cross_partition_query=True,
            )
            comments = [item for item in comments_it]
            post["commentCount"] = comments[0]
            # 查询帖子的点赞数
            likes_it = container.query_items(
                query="""
                    SELECT 
                        VALUE COUNT(1) 
                    FROM 
                        posts p 
                    WHERE 
                        p.postId = @post_id 
                        AND p.type = 'like'
                """,
                parameters=[{"name": "@post_id", "value": post["id"]}],
                enable_cross_partition_query=True,
            )
            likes = [item for item in likes_it]
            post["likeCount"] = likes[0]
            # 查询帖子发起者的用户名称
            user_it = container_users.query_items(
                query="SELECT u.username FROM users u WHERE u.id = @user_id",
                parameters=[{"name": "@user_id", "value": post["userId"]}],
                enable_cross_partition_query=True,
            )
            user = [item for item in user_it]
            post["username"] = user[0]["username"]
            # post对象放入集合
            posts.append(post)
        # 返回数据
        return posts
    except Exception as e:
        # return "数据查询失败" + str(e)
        raise ValueError("数据查询失败: " + str(e)) from e


# 查询user1用户的帖子
@router.post("/searchUser1Posts", description="查询user1用户的帖子")
async def search_user1_posts():
    """[Q6] 以短格式列出最近创建的 x 个帖子（源）"""
    container = db.get_container_client("demo_posts")
    try:
        # 查询数据
        # 查询用户user1的帖子
        posts_it = container.query_items(
            query="SELECT * FROM posts p WHERE p.userId = @user_id",
            parameters=[{"name": "@user_id", "value": "user1"}],
            enable_cross_partition_query=True,
        )
        # 取得posts对象
        posts = [item for item in posts_it]
        # 返回数据
        return posts
    except Exception as e:
        # return "数据查询失败" + str(e)
        raise ValueError("数据查询失败: " + str(e)) from e


# 获取用户
def get_user(item_id, item_name):
    """获取用户"""
    user = {
        "id": item_id,
        "username": item_name,
    }
    return user


# 获取帖子
def get_post(item_id, user_id, title, content):
    """获取帖子"""
    post = {
        "id": item_id,
        "type": "post",
        "postId": item_id,
        "userId": user_id,
        "title": title,
        "content": content,
        "creationDate": "2024-07-16",
    }
    return post


# 获取评论
def get_comment(item_id, post_id, user_id, content):
    """获取评论"""
    comment = {
        "id": item_id,
        "type": "comment",
        "postId": post_id,
        "userId": user_id,
        "content": content,
        "creationDate": "2024-07-16",
    }
    return comment
