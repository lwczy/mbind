
function mbind(data, root_element) {

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    }

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        })
    }

    function contentparser(content) {
        content = content.replace(/\$\{(.*)\}/, '\${this.$($1)}')
        console.log(content)
        return 'return \`' + content + '\`'
    }

    function render(bindlist, proxy_obj, element) {
        for (attr of element.attributes) {
            switch (attr.name) {
                case "@foreach": {
                    let parms = attr.value.split(",")
                    if (!element.tempFunc)
                        element.tempFunc = new Function(parms[0], contentparser(element.innerHTML || "")).bind({ $: escapeHtml })
                    if (!element.rendFunc)
                        element.rendFunc = function (list) {
                            content = ""
                            for (v of list)
                                content += element.tempFunc(v)
                            element.innerHTML = content
                        }
                    bindlist[parms[1]].elements.push(element)

                    element.rendFunc(bindlist[parms[1]].val)

                    break
                }
                case "@bind": {
                    //let parms = attr.value.split(",")
                    let parm = attr.value
                    let el_name = element.tagName.toLowerCase()
                    if (el_name === "input" || el_name === "textarea") {
                        if (!element.rendFunc)
                            element.rendFunc = function (val) {
                                element.value = val
                            }
                        element.oninput = () => proxy_obj[parm] = element.value
                    }
                    else {
                        if (!element.tempFunc)
                            element.tempFunc = new Function(parm, contentparser(element.innerHTML || "")).bind({ $: escapeHtml })
                        if (!element.rendFunc)
                            element.rendFunc = function (val) {
                                element.innerHTML = element.tempFunc(val)
                            }
                    }
                    bindlist[parm].elements.push(element)
                    element.rendFunc(bindlist[parm].val)
                    break
                }
                default:
                    break
            }
        }
        for (e of element.children)
            render(bindlist, proxy_obj, e)
    }

    function create_inner_object(obj) {
        ret = {}
        for (name in obj) {
            ret[name] = {
                val: obj[name],
                elements: []
            }
        }
        return ret
    }

    let inner_object = create_inner_object(data)
    let option_handler = {
        set: function (obj, prop, value) {
            for (ele of obj[prop].elements)
                ele.rendFunc(value)

            obj[prop].val = value;
            return true;
        },
        get: function (obj, prop) {
            return obj[prop].val;
        }
    }

    proxy_data = new Proxy(inner_object, option_handler);

    render(inner_object, proxy_data, root_element)
    return proxy_data
}