import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { FiUpload } from "react-icons/fi";
import { AiOutlineFileAdd } from "react-icons/ai";

const FileUploadModal = ({
  open,
  setOpen,
  handleUpload,
  handleFileChange,
  progress,
  setProgress,
  file,
  setFile,
  columns,
  image,
}) => {
  const onClose = () => {
    setOpen(!open);
    setFile(null);
    setProgress(0);
  };

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader>Upload File</DialogHeader>
      <DialogBody>
        <div className="flex flex-col items-center space-y-4">
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center p-3 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition duration-200"
          >
            <AiOutlineFileAdd className="mr-2 text-lg" />
            <span className="text-sm">Choose a file</span>
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".xls, .xlsx"
          />

          {file && (
            <div className="text-center">
              <p className="text-sm font-medium">Selected file: {file.name}</p>
            </div>
          )}

          {/* Instructions Section */}
          <div className="mt-4 p-4 border rounded-lg bg-gray-50 text-sm">
            <p className="font-semibold">Instructions:</p>
            <ul className="list-disc ml-5">
              <li>Ensure the file contains the following columns:</li>
              <ul className="list-inside">
                {columns.map((col, index) => (
                  <li key={index}>{col}</li>
                ))}
              </ul>
              <li>Each column should be properly labeled as shown above.</li>
              <li>The file must be in .xls or .xlsx format.</li>
            </ul>
            <p className="mt-2 text-gray-600">Example screenshot:</p>
            <div className="text-center">
              <img
                src={image}
                alt="Example File Screenshot"
                className="max-w-md mx-auto mt-2"
              />
            </div>
          </div>

          {/* Progress Bar */}
          {progress > 0 && progress < 100 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {progress === 100 && (
            <p className="text-green-500">Upload complete!</p>
          )}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="blue" onClick={onClose} className="mr-1">
          Close
        </Button>
        <Button
          color="blue"
          onClick={handleUpload}
          disabled={progress === 100 || !file}
          className="flex items-center space-x-2"
        >
          <FiUpload />
          <span>Upload</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default FileUploadModal;
