export var data = {
    type: 'root',
    children: [
        {
            type: 'paragraph',
            indentation: 2,
            isPresenter: true,
            content: {
                str: "[[formula(c = \\pm\\sqrt{a^2 + b^2})]]成立"
            }
        },
        {
            type: 'captionImage',
            indentation: 2,
            isPresenter: true,
            content: {
                caption: '一坨猫',
                imageUrl: 'https://www.necoichi.co.jp/files/topics/6239_ext_01_0.jpg'
            }
        },
        {
            type: 'table',
            children: [
                {
                    type: 'row',
                    children: [
                        {
                            type: 'cell',
                            children: [
                                {
                                    type: 'paragraph',
                                    indentation: 2,
                                    isPresenter: true,
                                    content: {
                                        str: "当且仅当[[formula(c = \\pm\\sqrt{a^2 + b^2})]]成立"
                                    }
                                },
                            ]
                        },
                        {
                            type: 'cell',
                            children: [
                                {
                                    type: 'paragraph',
                                    indentation: 2,
                                    isPresenter: true,
                                    content: {
                                        str: "当且仅当[[formula(c = \\pm\\sqrt{a^2 + b^2})]]成立"
                                    }
                                },
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}