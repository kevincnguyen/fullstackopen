const Course = ({course}) => {
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total sum={calculateSum(course.parts)}/>
      </div>
    )
}
  
const Header = ({ course }) => {
    return (
        <h2>{course}</h2>
    )
}
  
const Content = ({ parts }) => {
    return (
    <>
        {parts.map((part) => <Part part={part} />)}
    </>
    )
} 
  
const Part = ({ part }) => {
    return (
    <p>
        {part.name} {part.exercises}
    </p>
    )
}

const Total = ({ sum }) => {
    return (
    <p>
        <strong>Number of exercises {sum}</strong>
    </p>
    )
}

const calculateSum = (parts) => {
    const sum = parts.reduce((totalExercises, part) => {
    return totalExercises + part.exercises
    }, 0)
    return sum
}

export default Course 