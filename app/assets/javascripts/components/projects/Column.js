import React from 'react'

function Story(props){
  return (
    <div>
      {props.title}
    </div>
  )
}

function Stories(props){
  console.log(props)
  if(!props.stories.length){
    return null
  }
  return (
    <div>
      {props.stories.map( story => (
    <Story
      key={story.id}
      {...story}
    />
  ))}
  </div>
)
}

function Column(props){
  console.log(props)
  return (
      <div className={props.className}>
        <h1>{props.title}</h1>
        <Stories stories={props.stories} />
     </div>)
}

export default Column
