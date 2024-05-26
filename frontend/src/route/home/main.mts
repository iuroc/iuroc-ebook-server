import van from 'vanjs-core'
import { Route } from 'vanjs-router'

const { div } = van.tags

export default () => {

    return Route({ name: 'home' },
        div('Hello World')
    )
}