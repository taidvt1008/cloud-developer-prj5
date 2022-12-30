// eslint-disable-next-line
import * as React from 'react'

export class DetailBlog extends React.Component {

  componentDidMount(): void {
    console.log("props: ", this.props);
  }

  render() {
    return (
      <>
        <h1>Blog Detail</h1>
      </>
    )
  }
}