import { UniqueIdentifier, useDraggable } from '@dnd-kit/core';
import CloseIcon from '@mui/icons-material/Close';
import { ComponentPropsWithoutRef, FC, forwardRef } from 'react';

import { getStartingPlanSemester, isEarlierSemester } from '@/utils/plannerUtils';

import { DragDataFromSemesterTile, DraggableCourse, Semester } from '../types';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import { displaySemesterCode } from '@/utils/utilFunctions';
import CheckIcon from '@mui/icons-material/Check';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

export interface SemesterCourseItemProps extends ComponentPropsWithoutRef<'div'> {
  course: DraggableCourse;
  isValid?: boolean;
  isTransfer?: boolean;
  onRemove?: (course: DraggableCourse) => void;
}

/** UI implementation of a semester course */
export const SemesterCourseItem = forwardRef<HTMLDivElement, SemesterCourseItemProps>(
  function SemesterCourseItem({ course, isValid, isTransfer, onRemove, ...props }, ref) {
    // Create text output for sync icon
    const correctSemester = course.sync?.correctSemester
      ? `Course already taken in ${displaySemesterCode(course.sync?.correctSemester)}`
      : `No record of this course in Course History`;

    return (
      <div
        ref={ref}
        {...props}
        data-tip="delete here"
        className={`tooltip tooltip-left flex h-[40px] w-full flex-row items-center justify-between rounded-md py-[1px] px-[8px] shadow-md  ${
          isValid ? 'border-[1px] border-red-500' : ''
        }`}
      >
        <span className="text-[16px] text-[#1C2A6D]">
          <DragIndicatorIcon fontSize="inherit" className="mr-3 text-[16px] text-[#D4D4D4]" />
          {course.code}
        </span>

        <div className="flex  text-[12px] font-semibold">
          {course.taken && (
            <span className=" tooltip text-[#22C55E]" data-tip="Completed">
              <CheckIcon fontSize="small" />
            </span>
          )}
          {course.transfer && (
            <span className="tooltip text-green-500" data-tip="Transfer">
              T
            </span>
          )}
          {!course.sync?.isSynced && (
            <div className="tooltip" data-tip={`${correctSemester}`}>
              <SyncProblemIcon fontSize="small" />
            </div>
          )}
        </div>
        {/* <div
          onClick={(e) => {
            e.stopPropagation();
            onRemove && onRemove(course);
          }}
        >
          <CloseIcon className="self-end" fontSize="small" />
        </div> */}
      </div>
    );
  },
);

export interface DraggableSemesterCourseItemProps {
  dragId: UniqueIdentifier;
  semester: Semester;
  course: DraggableCourse;
  isValid: boolean;
  onRemove: (course: DraggableCourse) => void;
}

/** Compositional wrapper around SemesterCourseItem */
const DraggableSemesterCourseItem: FC<DraggableSemesterCourseItemProps> = ({
  dragId,
  semester,
  course,
  onRemove,
}) => {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: dragId,
    data: { from: 'semester-tile', semester, course } as DragDataFromSemesterTile,
  });

  return (
    <SemesterCourseItem
      ref={setNodeRef}
      style={{
        visibility: isDragging ? 'hidden' : 'unset',
      }}
      {...attributes}
      {...listeners}
      course={course}
      onRemove={onRemove}
    />
  );
};

export default DraggableSemesterCourseItem;
