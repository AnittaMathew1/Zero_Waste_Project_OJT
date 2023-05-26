import React from 'react'
import { render, waitFor, fireEvent } from './customRender'
import { screen, act } from '@testing-library/react'
import BookingHistory from '../views/pages/Houseowner/BookingHistory/BookingHistory'
import * as api from '../components/Commonhttp/Commonhttp'

jest.mock('../components/Commonhttp/Commonhttp')
beforeEach(() => jest.clearAllMocks())

describe('Booking History Component', () => {
  test('should show message with null from API response', async () => {
    const mockResponse = {}
    api.postRequest.mockResolvedValueOnce(mockResponse)
    await act(async () => {
      render(<BookingHistory />)
    })
    const noRecordsMessage = screen.getByText('There are no records to display')
    expect(noRecordsMessage).toBeInTheDocument()
  })

  test('should render DataTable with data from API response', async () => {
    const data = [
      {
        bookingDate: '03/10/2023',
        collectionDate: '04/27/2023',
        status: 'Collected',
        supervisorName: 'Anitta',
        wasteType: 'Plastic',
      },
    ]

    api.postRequest.mockResolvedValueOnce({ data: data })
    await act(async () => {
      render(<BookingHistory />)
    })

    const dataCells = screen.getAllByRole('cell')
    expect(dataCells[0]).toHaveTextContent(data[0].bookingDate)
    expect(dataCells[1]).toHaveTextContent(data[0].collectionDate)
    expect(dataCells[4]).toHaveTextContent(data[0].status)
    expect(dataCells[3]).toHaveTextContent(data[0].supervisorName)
    expect(dataCells[2]).toHaveTextContent(data[0].wasteType)
  })

  test('should display correct data based on pagination onclick of next button', async () => {
    const totalData = 15
    const data = []
    for (let i = 1; i <= totalData; i++) {
      data.push({
        bookingDate: `${i}/${i}/2023`,
        collectionDate: `${i}/${i}/2023`,
        status: `Collected`,
        supervisorName: `Customer ${i}`,
        wasteType: `Waste Type ${i}`,
      })
    }
    api.postRequest.mockResolvedValue({ data: data })
    const { container } = await act(async () => {
      return render(<BookingHistory />)
    })
    await waitFor(() => {
      const nextPageButton = container.querySelector('#pagination-next-page')
      fireEvent.click(nextPageButton)
    })

    expect(screen.queryByText('Customer 5')).not.toBeInTheDocument()
    expect(screen.getByText('Customer 11')).toBeInTheDocument()
    expect(screen.getByText('Customer 12')).toBeInTheDocument()
    expect(screen.queryByText('Customer 1')).not.toBeInTheDocument()
  })

  test('should display correct data based on pagination onclick of previous button', async () => {
    const totalData = 15
    const data = []
    for (let i = 1; i <= totalData; i++) {
      data.push({
        bookingDate: `${i}/${i}/2023`,
        collectionDate: `${i}/${i}/2023`,
        status: `Collected`,
        supervisorName: `Customer ${i}`,
        wasteType: `Waste Type ${i}`,
      })
    }
    api.postRequest.mockResolvedValue({ data: data })
    const { container } = await act(async () => {
      return render(<BookingHistory />)
    })
    await waitFor(() => {
      const nextPageButton = container.querySelector('#pagination-next-page')
      fireEvent.click(nextPageButton)
      const prevPageButton = container.querySelector('#pagination-previous-page')
      fireEvent.click(prevPageButton)
    })

    expect(screen.getByText('Customer 1')).toBeInTheDocument()
    expect(screen.queryByText('Customer 11')).not.toBeInTheDocument()
  })

  test('should display correct data based on pagination onclick of last page button', async () => {
    const totalData = 15
    const data = []
    for (let i = 1; i <= totalData; i++) {
      data.push({
        bookingDate: `${i}/${i}/2023`,
        collectionDate: `${i}/${i}/2023`,
        status: `Collected`,
        supervisorName: `Customer ${i}`,
        wasteType: `Waste Type ${i}`,
      })
    }
    api.postRequest.mockResolvedValue({ data: data })
    const { container } = await act(async () => {
      return render(<BookingHistory />)
    })
    await waitFor(() => {
      const lastPageButton = container.querySelector('#pagination-last-page')
      fireEvent.click(lastPageButton)
    })

    expect(screen.getByText('Customer 12')).toBeInTheDocument()
    expect(screen.queryByText('Customer 5')).not.toBeInTheDocument()
  })

  test('should display correct data based on pagination onclick of first page button', async () => {
    const totalData = 15
    const data = []
    for (let i = 1; i <= totalData; i++) {
      data.push({
        bookingDate: `${i}/${i}/2023`,
        collectionDate: `${i}/${i}/2023`,
        status: `Collected`,
        supervisorName: `Customer ${i}`,
        wasteType: `Waste Type ${i}`,
      })
    }
    api.postRequest.mockResolvedValue({ data: data })
    const { container } = await act(async () => {
      return render(<BookingHistory />)
    })
    await waitFor(() => {
      const lastPageButton = container.querySelector('#pagination-last-page')
      fireEvent.click(lastPageButton)
      const firstPageButton = container.querySelector('#pagination-first-page')
      fireEvent.click(firstPageButton)
    })

    expect(screen.getByText('Customer 1')).toBeInTheDocument()
    expect(screen.queryByText('Customer 11')).not.toBeInTheDocument()
  })
})
