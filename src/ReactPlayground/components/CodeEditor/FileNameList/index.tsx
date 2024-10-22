import { useContext, useState, useEffect } from "react"
import { PlaygroundContext } from "../../../PlaygroundContext"
import { FileNameItem } from "./FileNameItem"
import styles from './index.module.scss'
import { APP_COMPONENT_FILE_NAME, ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME } from "../../../files"


export default function FileNameList() {
    const {
        files,
        removeFile,
        addFile,
        updateFileName,
        selectedFileName,
        setSelectedFileName
    } = useContext(PlaygroundContext)

    const [tabs, setTabs] = useState([''])
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        setTabs(Object.keys(files))
    }, [files])

    const handleEditComplete = (name: string, preName: string) => {
        updateFileName(preName, name);
        setSelectedFileName(name);
        setCreating(false);
    }

    const addTab = () => {
        addFile('Comp' + Math.random().toString().slice(2, 6) + '.tsx')
        setCreating(true);
    }

    const handleRemove = (name: string) => {
        removeFile(name)
        setSelectedFileName(ENTRY_FILE_NAME)
    }

    const readonlyFileNames = [ENTRY_FILE_NAME, IMPORT_MAP_FILE_NAME, APP_COMPONENT_FILE_NAME];

    return <div className={styles.tabs}>
        {
            tabs.map((item, index, arr) => (
                <FileNameItem
                    key={item + index}
                    value={item}
                    actived={selectedFileName === item}
                    creating={creating && index === arr.length - 1}
                    readonly={readonlyFileNames.includes(item)}
                    onClick={() => setSelectedFileName(item)}
                    onEditComplete={(name: string) => handleEditComplete(name, item)}
                    onRemove={() => { handleRemove(item) }}
                ></FileNameItem>
            ))
        }
        <div className={styles.add} onClick={addTab}>+</div>
    </div>
}