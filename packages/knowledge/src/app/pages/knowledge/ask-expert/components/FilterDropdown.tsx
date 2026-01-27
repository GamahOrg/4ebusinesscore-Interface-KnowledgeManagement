import { FC } from 'react'
import { useIntl } from "react-intl";

const FilterDropdown: FC = () => {
	const intl = useIntl()

	return <>
		<a onClick={(event) => { event.preventDefault() }} className="btn btn-custom btn-active-white btn-flex btn-color-white btn-active-color-primary fw-bolder" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
			<span className="svg-icon svg-icon-5 svg-icon-gray-500 me-1">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path d="M19.0759 3H4.72777C3.95892 3 3.47768 3.83148 3.86067 4.49814L8.56967 12.6949C9.17923 13.7559 9.5 14.9582 9.5 16.1819V19.5072C9.5 20.2189 10.2223 20.7028 10.8805 20.432L13.8805 19.1977C14.2553 19.0435 14.5 18.6783 14.5 18.273V13.8372C14.5 12.8089 14.8171 11.8056 15.408 10.964L19.8943 4.57465C20.3596 3.912 19.8856 3 19.0759 3Z" fill="currentColor" />
				</svg>
			</span>
			{intl.formatMessage({ id: "Filtering" })}
		</a>

		<div
            className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary w-200px fw-bold fs-7 py-4'
            data-kt-menu='true'
          >
            <div className='menu-item d-flex justify-content-between align-items-center px-2 mb-2'>
              <label htmlFor='myQ' className='text-gray-500 fw-normal'>{intl.formatMessage({ id: "MyQuestions" })}</label>
              <input type='checkbox' name='myQ' id='myQ' />
            </div>
            <div className='menu-item d-flex justify-content-between align-items-center px-2'>
              <label htmlFor='allQ' className='text-gray-500 fw-normal'>{intl.formatMessage({ id: "AllQuestions" })}</label>
              <input type='checkbox' name='allQ' id='allQ' />
            </div>
          </div>
	</>
}

export { FilterDropdown }
