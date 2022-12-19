import React from 'react'
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar'
import TagsList from './TagsList'
import './Tags.css'

const Tags = () => {

    const tagsList = [{
        id: 1,
        tagName: "Java",
        tagDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque quisquam facilis aliquam iusto accusamus ut ducimus, inventore natus non aspernatur, quo autem nihil sequi tenetur vero molestiae, deserunt labore ullam."
    },
    {
        id: 2,
        tagName: "C++",
        tagDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque quisquam facilis aliquam iusto accusamus ut ducimus, inventore natus non aspernatur, quo autem nihil sequi tenetur vero molestiae, deserunt labore ullam."
    },
    {
        id: 3,
        tagName: "Python",
        tagDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque quisquam facilis aliquam iusto accusamus ut ducimus, inventore natus non aspernatur, quo autem nihil sequi tenetur vero molestiae, deserunt labore ullam."
    },
    {
        id: 4,
        tagName: "C#",
        tagDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque quisquam facilis aliquam iusto accusamus ut ducimus, inventore natus non aspernatur, quo autem nihil sequi tenetur vero molestiae, deserunt labore ullam."
    },
    {
        id: 5,
        tagName: "Golang",
        tagDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque quisquam facilis aliquam iusto accusamus ut ducimus, inventore natus non aspernatur, quo autem nihil sequi tenetur vero molestiae, deserunt labore ullam."
    },
    {
        id: 6,
        tagName: "Javascript",
        tagDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque quisquam facilis aliquam iusto accusamus ut ducimus, inventore natus non aspernatur, quo autem nihil sequi tenetur vero molestiae, deserunt labore ullam."
    },
    {
        id: 7,
        tagName: "TypeScript",
        tagDesc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque quisquam facilis aliquam iusto accusamus ut ducimus, inventore natus non aspernatur, quo autem nihil sequi tenetur vero molestiae, deserunt labore ullam."
    },
    ]

    return (
        <div className = "home-container-1">
            <LeftSidebar/>
            <div className="home-container-2">
                <h1 className='tags-h1'>Tags</h1>
                <p className='tags-p'>A tag is a keyword or label that categorizes your question with other, similar questions.</p>
                <div className='tags-list-container'>
                    {
                        tagsList.map((tag) => (
                            <TagsList tag = {tag} key = {tagsList.id}/>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Tags
