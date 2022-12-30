import dateFormat from 'dateformat'
import { History } from 'history'
// import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Loader,
  Modal,
  Form,
  TextArea
} from 'semantic-ui-react'

import { createBlog, deleteBlog, getBlogs, patchBlog, findBlogByName } from '../api/blogs-api'
import Auth from '../auth/Auth'
import { Blog } from '../types/Blog'

interface BlogsProps {
  auth: Auth
  history: History
}

interface BlogsState {
  blogs: Blog[]
  newBlogName: string
  loadingBlogs: boolean
  show: boolean,
  blogUpdate: Blog,
  searchValue: string,
  file: any,
  update: boolean
}

export class Blogs extends React.PureComponent<BlogsProps, BlogsState> {

  emptyBlog: Blog = {
    blogId: "",
    title: "",
    content: "",
    imageUrl: "",
    createdAt: "",
    updatedAt: "",
  }

  state: BlogsState = {
    blogs: [],
    newBlogName: '',
    loadingBlogs: true,
    show: false,
    blogUpdate: this.emptyBlog,
    searchValue: '',
    file: undefined,
    update: false
  }

  handleClose = () => { this.setState({ show: false }) };
  handleShow = () => { this.setState({ show: true }) };

  onCreate = async () => {
    try {
      const newBlog = await createBlog(this.props.auth.getIdToken(), {
        title: this.state.blogUpdate.title,
        content: this.state.blogUpdate.content,
      }, this.state.file[0]
      )
      console.log(newBlog)
      this.componentDidMount()
    } catch (e) {
      alert(`Blog creation failed ${e}`)
    }
  }
  onUpdate = async () => {
    console.log("imageUrl", this.state.blogUpdate.imageUrl)
    try {
      let changedImage = false
      if (this.state.file != null) {
        changedImage = true
      }

      await patchBlog(this.props.auth.getIdToken(), this.state.blogUpdate.blogId, {
        title: this.state.blogUpdate.title,
        content: this.state.blogUpdate.content,
        imageUrl: this.state.blogUpdate.imageUrl,
        changedImage: changedImage
      }, this.state.file != null ? this.state.file[0] : null).then(() => {
        this.componentDidMount()
      }
      )
    } catch (e) {
      alert(`Blog update failed ${e}`)
    }
  }

  onSearch = async () => {
    try {
      console.log("avvv")
      if (this.state.searchValue !== "") {
        const newBlog = await findBlogByName(this.props.auth.getIdToken(), this.state.searchValue)
        if ((newBlog.length) !== 0) {
          console.log(newBlog)
          this.setState({
            blogs: newBlog,
            searchValue: ""
          })
        } else {
          this.setState({
            searchValue: ""
          })
          alert('Not found any blog')
        }

      }
    } catch (e) {
      alert(`Search blog faulure: ${e}`)
    }
  }

  onDelete = async (BlogId: string) => {
    try {
      await deleteBlog(this.props.auth.getIdToken(), BlogId)
      this.setState({
        blogs: this.state.blogs.filter(blog => blog.blogId !== BlogId)
      })
    } catch {
      alert('Blog deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const blogs = await getBlogs(this.props.auth.getIdToken())
      this.setState({
        blogs,
        loadingBlogs: false
      })
    } catch (e) {
      alert(`Failed to fetch blogs: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Button color='grey' onClick={() => {
          this.componentDidMount()
          this.renderBlogList()
          this.setState({ blogUpdate: this.emptyBlog })
        }}>
          <Icon name="sync" />
        </Button>
        <Header as="h1">BLOGS</Header>
        {this.renderSearch()}
        {this.renderCreateBlogInput()}
        {this.renderBlogs()}
        {this.renderModal()}
      </div>
    )
  }
  renderSearch() {
    return (
      <Form onSubmit={async () => {
        await this.onSearch()
        this.renderBlogList()

      }}>
        <Form.Group>
          <input placeholder='Search any word of blog here...' onChange={(e) => {
            this.setState({ searchValue: e.target.value })
          }} />

          <Button color='green' type='submit'>
            <Icon name="search" />
          </Button>

        </Form.Group>
      </Form>
    )
  }

  renderCreateBlogInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Button
            icon
            color="blue"
            onClick={() => {
              this.handleShow()
            }}
          >
            <Icon name="add" />New blog
          </Button>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderBlogs() {
    if (this.state.loadingBlogs) {
      return this.renderLoading()
    }

    return this.renderBlogList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading BLOGS
        </Loader>
      </Grid.Row>
    )
  }

  renderBlogList() {
    return (
      <Grid padded>
        {this.state.blogs.map((blog, pos) => {
          return (
            <Grid.Row key={blog.blogId}>
              <Grid.Column width={12} verticalAlign="top">
                <h1> {blog.title}</h1>
              </Grid.Column>

              <Grid.Column width={12} verticalAlign="middle">
                {blog.updatedAt}
              </Grid.Column>

              <Grid.Column width={6} floated="left">
                <Button
                  icon
                  color="yellow"
                  onClick={() => {
                    this.handleShow()
                    this.setState({ blogUpdate: blog, update: true })
                  }}
                >
                  <Icon name="pencil" />Edit
                </Button>

                <Button
                  icon
                  color="red"
                  onClick={() => this.onDelete(blog.blogId)}
                >
                  <Icon name="delete" />Remove
                </Button>

              </Grid.Column>

              <Grid.Column width={12} verticalAlign="middle">
                {blog.imageUrl && (
                  <Image src={blog.imageUrl} size="medium" wrapped type />
                )}
              </Grid.Column>

              <Grid.Column width={12} verticalAlign="middle">
                {blog.content}
              </Grid.Column>
              
              <Grid.Column width={12}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }

  renderModal() {
    return (
      <Modal
        onClose={() => this.handleClose()}
        onOpen={() => this.handleShow()}
        open={this.state.show}
      >
        <Modal.Header>{this.state.blogUpdate.title !== "" ? "Update Blog" : "Create Blog"}</Modal.Header>
        <Modal.Content >
          <Form onSubmit={() => {
            if (this.state.update === true) {
              this.onUpdate()
              this.handleClose()
              this.setState({ blogUpdate: this.emptyBlog, file: undefined, update: false })
            } else {
              this.onCreate()
              this.handleClose()
              this.setState({ blogUpdate: this.emptyBlog, file: undefined, update: false })
            }

          }}>
            <Form.Field>
              <label>Blog Title</label>
              <input placeholder='Title' defaultValue={this.state.blogUpdate.title} onChange={(e) => {
                this.state.blogUpdate.title = e.target.value
                this.setState({ blogUpdate: this.state.blogUpdate })
              }} />
            </Form.Field>

            <Form.Field>
              <label>Blog Content</label>
              <TextArea placeholder='Content' defaultValue={this.state.blogUpdate.content} onChange={(e) => {
                this.state.blogUpdate.content = e.target.value
                this.setState({ blogUpdate: this.state.blogUpdate })
              }} />
            </Form.Field>

            <Form.Field>
              <label>Blog Image</label>
              <input type="file" id="img" name="img" accept="image/*" onChange={(e) => {
                this.state.file = e.target.files
                this.setState({ file: this.state.file })
              }} />
            </Form.Field>

            <Button onClick={() => {
              this.handleClose()
              this.setState({ blogUpdate: this.emptyBlog })
            }}>
              Close
            </Button>
            <Button color='green' type='submit'>Submit</Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}




