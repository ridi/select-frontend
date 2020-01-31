import React from 'react';

export const BookDetailPlaceholder: React.SFC = () => (
  <main className="SceneWrapper PageBookDetail Skeleton_Wrapper">
    <div className="DetailHeader_Skeleton_Wrapper">
      <span className="Thumbnail_Skeleton Skeleton" />
      <div className="Metadata_Skeleton_Wrapper">
        <span className="Category_Skeleton Skeleton" />
        <span className="Title_Skeleton Skeleton" />
        <span className="Description_Skeleton Skeleton" />
        <div className="Button_Skeleton_Wrapper">
          <span className="Button_Skeleton Small_Button_Skeleton Skeleton" />
          <span className="Button_Skeleton Big_Button_Skeleton Skeleton" />
        </div>
      </div>
    </div>
  </main>
);
