export { WikiMDJSONCOmponent } from "./WikiMDJSONComponent"
import { WikiMD as WKMD } from "./wikiMD"

export const WikiMD = WKMD

const md_test = `
        
# Ciao!

* asd
* asd

**asdasd** _asd_

![asd](https://avatars1.githubusercontent.com/u/14985020?s=400&v=4)

<div class="mermaid">
graph LR
A-->B
</div>`

// let wikiMD = new WikiMD({
//     elementId: "wiki-md",
//     editorMode: true,
//     initialMarkdown: md_test,
//     mermaidClass: ".mermaid",
// })
