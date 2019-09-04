// import "../styles/index.scss"

// import unified from "unified"
// import markdown from "remark-parse"
// import remark2rehype from "remark-rehype"
// import raw from "rehype-raw"
// // import mermaid from "remark-mermaid"

// var processor = unified()
//     // .use(mermaid, { simple: true })
//     .use(markdown)
//     .use(remark2rehype, { allowDangerousHTML: true })
//     .use(raw)

// console.log(processor.processSync("#TEST \n somo una prova"))

import unified from "unified"
// var unified = require("unified")
import markdown from "remark-parse"
import remark2rehype from "remark-rehype"
import html from "rehype-stringify"
import report from "vfile-reporter"
import raw from "rehype-raw"
// import remarkMermaid from "remark-mermaid"

const sample_graph = "```mermaid\n graph LR \nA-->B"

const TEST_MARKDOWN = `
# Ciao mondo

* asd
* asd

**asdasd** _asd_

![asd](https://avatars1.githubusercontent.com/u/14985020?s=400&v=4)

<div class="mermaid">
graph LR
A-->B
</div>
<div class="mermaid">
gantt
title A Gantt Diagram
dateFormat YYYY-MM-DD
section Section
A task :a1, 2014-01-01, 30d
Another task :after a1 , 20d
section Another
Task in sec :2014-01-12 , 12d
another task : 24d
</div>


${sample_graph}
`

export function renderMarkdown(text: string): Promise<string> {
    return new Promise((resolve, reject) => {
        unified()
            // .use(remarkMermaid, { simple: true })
            .use(markdown, {})
            .use(remark2rehype, { allowDangerousHTML: true })
            .use(html)
            .use(raw)
            .process(text, function(err, file) {
                if (err) {
                    console.error(report(err))
                    reject(err)
                } else {
                    resolve(file.toString())
                }
            })
    })
}
