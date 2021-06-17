import React from "react";

export function MatchFooter( { children } ) {
  return <div className="fixed bt b--white-20 bottom-0 left-0 right-0 mh-3 pa3 bg-black z-3">
    {children}
  </div>
}