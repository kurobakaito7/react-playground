import MonacoEditor, { OnMount, EditorProps } from '@monaco-editor/react'
import { createATA } from './ata';
import { editor } from 'monaco-editor'

export interface EditorFile {
    name: string
    value: string
    language: string
}

interface Props {
    file: EditorFile
    onChange?: EditorProps['onChange'],
    options?: editor.IStandaloneEditorConstructionOptions
}

export default function Editor(props: Props) {
    const {
        file,
        onChange,
        options
    } = props;

    const handleEditorMount: OnMount = (editor, monaco) => {
        // 添加快捷键的交互： cmd + j 的时候格式化代码
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, () => {
            editor.getAction('editor.action.formatDocument')?.run()
            /* const actions = editor.getSupportedActions().map((a) => a.id);
            console.log(actions); */
        });
        // 修改编辑器的tsconfig.json
        monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            // 设置 jsx 为 preserve，也就是输入 <div> 输出 <div>，保留原样
            jsx: monaco.languages.typescript.JsxEmit.Preserve,
            // 设置 esModuleInterop 会在编译的时候自动加上 default 属性
            esModuleInterop: true,
        })

        const ata = createATA((code, path) => {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`)
        })
        
        editor.onDidChangeModelContent(() => {
            ata(editor.getValue());
        });
        
        ata(editor.getValue());
    }

    return <MonacoEditor
        height='100%'
        path={file.name}
        language={file.language}
        onMount={handleEditorMount}
        onChange={onChange}
        value={file.value}
        options={
            {
                fontSize: 14,
                scrollBeyondLastLine: false,
                minimap: {
                    enabled: false,
                },
                scrollbar: {
                    verticalScrollbarSize: 6,
                    horizontalScrollbarSize: 6,
                },
               ...options,
            }
        }
    />
}