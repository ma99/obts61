@extends('layouts.app')

@section('content')

    <stops-map></stops-map>

@endsection

@section('scripts')
    <script src="{{ asset('js/map.js') }}"></script>
@endsection