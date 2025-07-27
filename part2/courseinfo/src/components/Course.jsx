const Headers = ({ course }) => {
    return (
        <h1>{course.name}</h1>
    );
}

const Part = ({ part }) => {
    return (
        <p>
            {part.name} {part.exercises}
        </p>
    );
}

const Content = ({ course }) => {
    return (
        <div>
            {course.parts.map(part =>
                <Part
                    key={part.id}
                    part={part}
                />
            )}
        </div>
    );
}

const Total = ({ course }) => {
    return (
        <h4>total of {course.parts.reduce((sum, curr) => sum + curr.exercises, 0)} exercises</h4>
    );
}

const Course = ({ course }) => (
    <div>
        <Headers course={course} />
        <Content course={course} />
        <Total course={course} />
    </div>
)

export default Course